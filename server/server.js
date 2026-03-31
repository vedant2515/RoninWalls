import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // For local dev flexibility
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
}));
app.use(express.json());

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

// Resend email client — works over HTTPS so Render never blocks it
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP store: Map<email, { otp, expiresAt }>
// For production, use Redis or MongoDB to avoid data loss on server restart
const otpStore = new Map();

// GET /api/wallpapers - Reads the folders in the S3 bucket and returns all items
app.get('/api/wallpapers', async (req, res) => {
    try {
        if (!process.env.AWS_BUCKET_NAME) {
            return res.status(500).json({ error: 'AWS_BUCKET_NAME is not configured on the server.' });
        }

        // Scan bucket up to 1000 items
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            MaxKeys: 1000,
        });

        const response = await s3Client.send(command);
        const contents = response.Contents || [];

        const wallpapers = contents
            .filter(item => item.Key && item.Size > 0) // Filter out pure folder objects (size 0)
            .map(item => {
                // e.g. item.Key might be "wallpapers/anime_desk/my-cool-image.jpg"
                const parts = item.Key.split('/');

                // Find the immediate parent folder name
                const folderName = parts.length > 1 ? parts[parts.length - 2].toLowerCase() : '';

                let mappedCategory = 'Uncategorized';
                // Default to mobile based on the specific mapping req: "anime, cars, amoled, gaming contains wallper for phone"
                let deviceType = 'Mobile';

                // 1. Enforce strict 4-category mapping based on folder strings
                if (folderName.includes('anime')) mappedCategory = 'Anime';
                else if (folderName.includes('cars')) mappedCategory = 'Cars';
                else if (folderName.includes('gaming')) mappedCategory = 'Gaming';
                else if (folderName.includes('amoled')) mappedCategory = 'AMOLED';
                else if (folderName && folderName !== 'wallpapers') {
                    // Fallback logic for rogue folders
                    mappedCategory = folderName.replace('_desk', '');
                    mappedCategory = mappedCategory.charAt(0).toUpperCase() + mappedCategory.slice(1);
                }

                // 2. Identify Device Type 
                if (folderName.endsWith('_desk')) {
                    deviceType = 'Desktop';
                }

                // 3. Format nice title using the filename
                let rawFileName = parts.pop() || '';
                let titleSplit = rawFileName.split('-');
                let titleRaw = titleSplit.length > 1 ? titleSplit.slice(1).join('-') : rawFileName;
                let title = titleRaw.split('.')[0].replace(/_/g, ' ') || 'Premium Wallpaper';

                return {
                    id: item.Key,
                    title: title.charAt(0).toUpperCase() + title.slice(1),
                    category: mappedCategory,
                    type: deviceType,
                    imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
                    lastModified: item.LastModified
                };
            })
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)); // Latest first

        res.json({ success: true, wallpapers });
    } catch (error) {
        console.error("Error fetching S3 objects:", error);
        res.status(500).json({ error: 'Failed to fetch wallpapers from S3', details: error.message });
    }
});

app.get('/api/get-presigned-url', async (req, res) => {
    try {
        const { fileName, fileType, category } = req.query;

        if (!fileName || !fileType || !category) {
            return res.status(400).json({ error: 'Missing required query parameters: fileName, fileType, category' });
        }

        if (!process.env.AWS_BUCKET_NAME) {
            return res.status(500).json({ error: 'AWS_BUCKET_NAME is not configured.' });
        }

        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const uniqueFileName = `${Date.now()}-${cleanFileName}`;
        const objectKey = `${category}/${uniqueFileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: objectKey,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        res.json({
            success: true,
            presignedUrl: signedUrl,
            objectKey: objectKey,
            publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate presigned URL', details: error.message });
    }
});

app.get('/api/download-url', async (req, res) => {
    try {
        const { key } = req.query;
        if (!key) return res.status(400).json({ error: 'Missing requested object key' });
        if (!process.env.AWS_BUCKET_NAME) return res.status(500).json({ error: 'AWS_BUCKET_NAME missing' });

        // Use GetObject with a forced attachment disposition so the browser natively downloads it without fetch CORS
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ResponseContentDisposition: `attachment; filename="RoninWalls_${key.split('/').pop()}"`
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        res.json({ success: true, downloadUrl: signedUrl });
    } catch (error) {
        console.error('Download URL generation error:', error);
        res.status(500).json({ error: 'Failed to generate download URL' });
    }
});

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required.' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store firmly for 10 minutes
        const expiresAt = Date.now() + 10 * 60 * 1000;
        otpStore.set(email, { otp, expiresAt });

        const mailOptions = {
            from: 'RoninWalls <onboarding@resend.dev>',
            to: email,
            subject: 'RoninWalls - Your Verification Code',
            html: `<div style="font-family: sans-serif; padding: 20px; background:#0a0a0a; color:#fff;">
                    <h2 style="color:#a855f7;">Welcome to RoninWalls!</h2>
                    <p>Your 6-digit verification code is:</p>
                    <h1 style="color: #6366f1; letter-spacing: 5px; font-size:2.5rem;">${otp}</h1>
                    <p style="color:#888;">This code will expire in 10 minutes.</p>
                   </div>`
        };

        // Check if Resend key is configured
        if (!process.env.RESEND_API_KEY) {
            console.log(`[MOCK EMAIL — No RESEND_API_KEY] OTP for ${email} is ${otp}`);
            return res.json({ success: true, message: 'Mock OTP generated. Check server logs.' });
        }

        const { error: resendError } = await resend.emails.send(mailOptions);
        if (resendError) throw new Error(resendError.message);

        res.json({ success: true, message: 'OTP sent successfully.' });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ 
            error: 'Failed to send OTP email.',
            details: error.message 
        });
    }
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required.' });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP.' });
        }

        // OTP is valid
        otpStore.delete(email); // Clean up
        res.json({ success: true, message: 'Email verified successfully.' });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Verification failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`RoninWalls Server running on http://localhost:${PORT}`);
});
