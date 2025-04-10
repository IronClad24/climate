import { BackgroundCircles, Gradient } from "./design/Hero";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';
import GoogleIcon from '../assets/my/icons8-google-48.svg'; // Add your Google icon path
import Section from "./Section";
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const parallaxRef = useRef(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Clear error message after 5 seconds
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { email, password } = formData;

        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setError('Please verify your email first. Check your inbox (and spam folder) for the verification link.');
                await auth.signOut();
                setLoading(false);
                return;
            }

            console.log('Logged in successfully:', user);
            setFormData({ email: '', password: '' });
            navigate('/', { state: { loginSuccess: true } });
        } catch (error) {
            const errorMessages = {
                'auth/user-not-found': 'No account found with this email. Want to sign up instead?',
                'auth/wrong-password': 'Incorrect password. Try again or reset your password.',
                'auth/invalid-email': 'Please enter a valid email address.',
                'auth/too-many-requests': 'Too many attempts. Please wait a bit and try again.',
                'auth/user-disabled': 'This account has been disabled. Contact support for help.',
                'auth/invalid-credential': 'Invalid credentials. Please check your email and password.'
            };
            setError(errorMessages[error.code] || 'Login failed. Please try again later.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setGoogleLoading(true);

        try {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log('Logged in with Google:', user);
            navigate('/', { state: { loginSuccess: true } });
        } catch (error) {
            const errorMessages = {
                'auth/account-exists-with-different-credential': 'This email is already linked to another login method.',
                'auth/popup-closed-by-user': 'Login window closed. Please try again.',
                'auth/popup-blocked': 'Popup blocked by browser. Please allow popups and try again.',
                'auth/operation-not-allowed': 'Google login is not enabled. Contact support.'
            };
            setError(errorMessages[error.code] || 'Google login failed. Please try again.');
            console.error('Google login error:', error);
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
            id="login"
        >
            <div className="container relative" ref={parallaxRef}>
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb:[6rem]">
                    <h1 className="h1 mb-6">
                        Welcome Back to AIHorizon
                    </h1>
                    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                        Log in to continue your journey towards a sustainable future
                    </p>

                    <div className="relative max-w-[30rem] mx-auto">
                        <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                            <div className="relative bg-n-8 rounded-[1rem] p-8">
                                <form className="space-y-6" onSubmit={handleLogin}>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-xl 
                                            text-n-2 focus:outline-none focus:border-n-2/50 disabled:opacity-70"
                                            disabled={loading || googleLoading}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-xl 
                                            text-n-2 focus:outline-none focus:border-n-2/50 disabled:opacity-70"
                                            disabled={loading || googleLoading}
                                        />
                                    </div>
                                    {error && (
                                        <div className="w-full text-red-500 bg-white text-center py-2 rounded-xl text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <Button 
                                        white 
                                        className="w-full" 
                                        disabled={loading || googleLoading}
                                    >
                                        {loading ? 'Logging In...' : 'Log In'}
                                    </Button>
                                </form>

                                <div className="mt-6">
                                    <Button 
                                        white 
                                        className="w-full" 
                                        onClick={handleGoogleLogin}
                                        disabled={loading || googleLoading}
                                    >
                                        <div className="flex items-center justify-center">
                                            <img src={GoogleIcon} alt="Google" className="w-6 h-6 mr-2" />
                                            {googleLoading ? 'Logging In...' : 'Log In with Google'}
                                        </div>
                                    </Button>
                                </div>

                                <div className="mt-4 text-n-2 text-sm flex justify-center gap-2">
                                    <a 
                                        href="/forgot-password" 
                                        className="hover:text-n-1 transition-colors"
                                    >
                                        Forgot Password?
                                    </a>
                                    <span>•</span>
                                    <a 
                                        href="/signup" 
                                        className="hover:text-n-1 transition-colors"
                                    >
                                        Create Account
                                    </a>
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

export default Login;