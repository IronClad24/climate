import { BackgroundCircles, Gradient } from "./design/Hero";
import React, { useRef, useState } from 'react';

import Button from './Button';
import Section from "./Section";
import { auth } from '../Firebase'; // Adjust path to your Firebase.jsx
import { signInWithEmailAndPassword } from 'firebase/auth';
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
            setError('Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setError('Please verify your email before logging in. Check your inbox for the verification link.');
                await auth.signOut(); // Sign out the user if email isn't verified
                setLoading(false);
                return;
            }

            console.log('Logged in successfully:', user);
            setFormData({ email: '', password: '' });
            navigate('/'); // Redirect to home page on successful login
        } catch (error) {
            let errorMessage = 'An error occurred during login.';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many login attempts. Please try again later.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled. Please contact support.';
                    break;
                default:
                    errorMessage = error.message;
            }
            setError(errorMessage);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
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
                        Welcome Back to EcoSphere
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
                                            text-n-2 focus:outline-none focus:border-n-2/50"
                                            disabled={loading}
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
                                            text-n-2 focus:outline-none focus:border-n-2/50"
                                            disabled={loading}
                                        />
                                    </div>
                                    {error && (
                                        <div className="w-full text-red-500 bg-white text-center py-2 rounded-xl">
                                            {error}
                                        </div>
                                    )}
                                    <Button white className="w-full" disabled={loading}>
                                        {loading ? 'Logging In...' : 'Log In'}
                                    </Button>
                                </form>
                                <div className="mt-4 text-n-2 text-sm">
                                    <a href="/forgot-password" className="hover:text-n-1 transition-colors">
                                        Forgot Password?
                                    </a>
                                    <span className="mx-2">•</span>
                                    <a href="/signup" className="hover:text-n-1 transition-colors">
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