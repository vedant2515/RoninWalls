import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data from Firestore
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUser({ id: firebaseUser.uid, ...userDoc.data() });
                } else {
                    // Fallback if doc doesn't exist yet
                    setUser({ id: firebaseUser.uid, email: firebaseUser.email });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    };

    const signup = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Send Firebase's built-in verification email (works on any network, no SMTP needed)
        await sendEmailVerification(firebaseUser);

        // Generate a unique username
        const baseName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const uniqueNum = Math.floor(Math.random() * 10000);
        const username = `${baseName}_${uniqueNum}`;

        // Create user document in Firestore
        const userData = {
            email,
            username,
            createdAt: new Date().toISOString(),
            savedWallpapers: [],
            history: []
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        setUser({ id: firebaseUser.uid, ...userData });
        return firebaseUser;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const updateUser = async (updatedFields) => {
        if (!user) return;

        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, updatedFields);

        setUser((prev) => ({ ...prev, ...updatedFields }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
