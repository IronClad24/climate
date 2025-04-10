import { BackgroundCircles, Gradient } from "./design/Hero";
import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, updateProfile } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';
import GoogleIcon from '../assets/my/icons8-google-48.svg';
import Section from "./Section";
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const parallaxRef = useRef(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { fullName, email, password, confirmPassword } = formData;

        if (!fullName || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: fullName });
            await sendEmailVerification(user);
            setVerificationSent(true);

            console.log('Signed up successfully and verification email sent:', user);
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });

            // Redirect to home with a signup success flag
            navigate('/', { state: { signupSuccess: true } });
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else if (error.code === 'auth/operation-not-allowed') {
                setError('Email/Password signup is not enabled. Please contact support.');
            } else {
                setError(error.message);
            }
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError(null);
        setGoogleLoading(true);

        try {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (!user.emailVerified) {
                await sendEmailVerification(user);
                setVerificationSent(true);
            }

            console.log('Signed up with Google:', user);
            navigate('/', { state: { signupSuccess: true } });
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                setError('This account exists with a different sign-in method.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                setError('Sign-in popup was closed before completion.');
            } else {
                setError(error.message);
            }
            console.error('Google signup error:', error);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <Section
            className="pt-[10rem] -mt-[5.25] overflow-hidden"
            crosses
            crossesOffset="lg:translate-y-[5.25rem]"
            customPaddings="pt-[12rem] -mt-[5.25rem]"
            id="signup"
        >
            <div className="container relative" ref={parallaxRef}>
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb:[6rem]">
                    <h1 className="h1 mb-6">Join AIHorizon Today</h1>
                    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                        Create your account and start making a difference for our planet
                    </p>
                    <div className="relative max-w-[30rem] mx-auto">
                        <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                            <div className="relative bg-n-8 rounded-[1rem] p-8">
                                <form className="space-y-6" onSubmit={handleEmailSignup}>
                                    {/* Form inputs unchanged */}
                                    <div>
                                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-xl text-n-2 focus:outline-none focus:border-n-2/50" disabled={loading} />
                                    </div>
                                    <div>
                                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-xl text-n-2 focus:outline-none focus:border-n-2/50" disabled={loading} />
                                    </div>
                                    <div>
                                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-xl text-n-2 focus:outline-none focus:border-n-2/50" disabled={loading} />
                                    </div>
                                    <div>
                                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-xl text-n-2 focus:outline-none focus:border-n-2/50" disabled={loading} />
                                    </div>
                                    {error && <div className="w-full text-red-500 bg-white text-center py-2 rounded-xl">{error}</div>}
                                    {verificationSent && <div className="w-full text-green-500 bg-white text-center py-2 rounded-xl">Verification email sent! Please check your inbox.</div>}
                                    <Button white className="w-full" disabled={loading}>
                                        {loading ? 'Signing Up...' : 'Sign Up'}
                                    </Button>
                                </form>
                                <div className="mt-6">
                                    <Button white className="w-full" onClick={handleGoogleSignup} disabled={googleLoading}>
                                        <div className="flex items-center justify-center">
                                            <img src={GoogleIcon} alt="Google" className="w-6 h-6 mr-2" />
                                            {googleLoading ? 'Signing Up...' : 'Sign Up with Google'}
                                        </div>
                                    </Button>
                                </div>
                                <div className="mt-4 text-n-2 text-sm">
                                    <span>Already have an account? </span>
                                    <a href="/login" className="hover:text-n-1 transition-colors">Log in here</a>
                                </div>
                            </div>
                            <Gradient />
                        </div>
                        <BackgroundCircles />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Signup;