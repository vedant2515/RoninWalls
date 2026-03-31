import { useState } from 'react';
import { Upload as UploadIcon, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import './Upload.css';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [deviceType, setDeviceType] = useState('Desktop');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selected);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title || !category) {
            alert("Please fill all required fields and select a file.");
            return;
        }

        try {
            setUploading(true);

            // 1. Get presigned URL from Backend Node.js Server
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-presigned-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}&category=${encodeURIComponent(category)}`);

            if (!response.ok) {
                throw new Error('Failed to get presigned URL from server. Is the backend running?');
            }

            const { presignedUrl, publicUrl } = await response.json();

            // 2. Execute direct PUT request to AWS S3 using the presigned URL
            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (!uploadResponse.ok) {
                throw new Error('AWS S3 rejected the upload! Check CORS or Bucket policy.');
            }

            alert(`Success! "${title}" was uploaded directly to AWS S3.\nPublic URL: ${publicUrl}`);
            clearFile();
            setTitle('');
            setCategory('');
            setDeviceType('Desktop');
        } catch (err) {
            console.error(err);
            alert(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-page container">
            <div className="upload-header">
                <h1 className="text-gradient">Publish Wallpaper</h1>
                <p className="text-secondary">Securely push high-quality creations directly to Amazon S3</p>
            </div>

            <div className="upload-grid">
                <div className="upload-form-section card">
                    <form onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="input-base"
                                placeholder="e.g. Neon Cyberpunk City"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={uploading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group flex-1">
                                <label>Category</label>
                                <select
                                    className="input-base"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={uploading}
                                >
                                    <option value="" disabled>Select category</option>
                                    <option value="Anime">Anime</option>
                                    <option value="Cars">Cars</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="AMOLED">AMOLED</option>
                                </select>
                            </div>

                            <div className="form-group flex-1">
                                <label>Device Type</label>
                                <select
                                    className="input-base"
                                    value={deviceType}
                                    onChange={(e) => setDeviceType(e.target.value)}
                                    disabled={uploading}
                                >
                                    <option value="Desktop">Desktop</option>
                                    <option value="Mobile">Mobile</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tags (Comma separated)</label>
                            <input type="text" className="input-base" placeholder="neon, futuristic, dark" disabled={uploading} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-4" disabled={uploading}>
                            {uploading ? (
                                <><Loader2 size={18} className="animate-spin" /> Uploading to S3...</>
                            ) : (
                                <><UploadIcon size={18} /> Publish Wallpaper</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="upload-preview-section">
                    <div className="preview-container card">
                        {preview ? (
                            <div className="preview-image-wrapper">
                                {!uploading && (
                                    <button className="clear-img-btn" onClick={clearFile} type="button">
                                        <X size={20} />
                                    </button>
                                )}
                                <img src={preview} alt="Upload Preview" className={`preview-img ${deviceType.toLowerCase()}`} style={{ opacity: uploading ? 0.5 : 1 }} />
                            </div>
                        ) : (
                            <div className="empty-preview" onClick={() => !uploading && document.getElementById('file-upload').click()}>
                                <div className="upload-icon-circle">
                                    <ImageIcon size={32} />
                                </div>
                                <h3>Drag & Drop</h3>
                                <p className="text-secondary">or click to browse your files</p>
                                <p className="text-muted mt-2">Supports JPG, PNG, WEBP up to 20MB</p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    hidden
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
