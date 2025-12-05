// src/Pages/Auth/AuthModal.tsx
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import FormButton from '../Components/FormButton';
import FormInput from '../Components/FormInput';
import FormInputField from '../Components/FormInputField';
import FormLabel from '../Components/FormLabel';
import Logo from '../Components/Logo';
import { useState } from 'react';
import { toast } from 'sonner';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangays?: { id: number; name: string }[];
    auth?: { user?: any };
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {

    const { props } = usePage<{ barangays?: { id: number; name: string }[] }>();
    const barangays = props.barangays ?? [];

    const [isLogin, setIsLogin] = useState(true);

    // Forms for login and register
    const loginForm = useForm({ email: '', password: '' });
    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        barangay: '',
    });

    // Handle login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onSuccess: () => {
                toast.success('Logged in successfully!');
            },
            onError: () => {
                toast.error('Invalid credentials. Please try again.');
            },
        });
    };


    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onSuccess: () => {
                toast.success('Account created successfully!');
                registerForm.reset();
                setIsLogin(true);
            },
            onError: (errors) => {
                toast.error('Registration failed. Please check the form and try again.');
                console.error(errors);
            },
        });
    };



    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        key={isLogin ? 'login' : 'register'}
                        className="relative mx-4 w-full max-w-6xl flex rounded-2xl bg-white shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Image Section - Left Side */}
                        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-50 to-blue-50 items-center justify-center p-8">
                            <div className="text-center">
                                <img
                                    src="/assets/Solid Waste.png"
                                    alt="Solid Waste Management"
                                    className="w-full max-w-xs h-auto mx-auto mb-6 rounded-lg"
                                />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Solid Waste Management
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Join us in creating a cleaner and greener environment for our community
                                </p>
                            </div>
                        </div>

                        {/* Form Section - Right Side */}
                        <div className="w-full md:w-1/2 p-8 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
                            >
                                ✕
                            </button>

                            <Head title={isLogin ? 'Login' : 'Register'} />

                            {/* Header */}
                            <div className="text-center">
                                <Logo width={90} height={90} className="mx-auto mb-4" altText="App Logo" />
                                <h1 className="mb-2 text-3xl font-bold">SWMIS</h1>
                                <h2 className="mb-2 text-xl font-semibold">
                                    {isLogin ? 'Welcome back!' : 'Hey there!'}
                                </h2>
                                <p className="mb-6 text-sm text-gray-600">
                                    {isLogin
                                        ? 'Login to access the dashboard and help the community better one step at a time.'
                                        : 'Sign up to access the dashboard and help the community better — one step at a time.'}
                                </p>
                            </div>

                            {/* --- LOGIN FORM --- */}
                            {isLogin ? (
                                <form onSubmit={handleLogin}>
                                    <FormInputField>
                                        <FormLabel htmlFor="email" textLabel="Email" />
                                        <FormInput
                                            id="email"
                                            type="email"
                                            placeholder="example@email.com"
                                            value={loginForm.data.email}
                                            onChange={(e) => loginForm.setData('email', e.target.value)}
                                            message={loginForm.errors.email}
                                            required
                                            className='w-full'
                                        />
                                    </FormInputField>

                                    <FormInputField>
                                        <FormLabel htmlFor="password" textLabel="Password" />
                                        <FormInput
                                            id="password"
                                            type="password"
                                            placeholder="********"
                                            value={loginForm.data.password}
                                            onChange={(e) => loginForm.setData('password', e.target.value)}
                                            message={loginForm.errors.password}
                                            required
                                            className='w-full'
                                        />
                                    </FormInputField>

                                    <FormInputField>
                                        <FormButton className="mt-3 w-full" submit="Login" />
                                        <p className="mt-4 text-center text-sm">
                                            Don't have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(false)}
                                                className="text-blue-600 underline"
                                            >
                                                Sign Up
                                            </button>
                                        </p>
                                    </FormInputField>
                                </form>
                            ) : (
                                /* --- REGISTER FORM --- */
                                <form onSubmit={handleSignup}>
                                    {/* Scrollable container: show ~2 fields and allow scrolling */}
                                    <div className="max-h-48 overflow-y-auto pr-2 space-y-4">
                                        {/* Name */}
                                        <FormInputField>
                                            <FormLabel htmlFor="name" textLabel="Name" />
                                            <FormInput
                                                id="name"
                                                type="text"
                                                placeholder="Juan Dela Cruz"
                                                value={registerForm.data.name}
                                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                                onFocus={(e) => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                                                message={registerForm.errors.name}
                                                required
                                                className="w-full"
                                            />
                                        </FormInputField>

                                        {/* Email */}
                                        <FormInputField>
                                            <FormLabel htmlFor="email" textLabel="Email" />
                                            <FormInput
                                                id="email"
                                                type="email"
                                                placeholder="example@email.com"
                                                value={registerForm.data.email}
                                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                                onFocus={(e) => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                                                message={registerForm.errors.email}
                                                required
                                                className="w-full"
                                            />
                                        </FormInputField>

                                        {/* Phone Number */}
                                        <FormInputField>
                                            <FormLabel htmlFor="phone_number" textLabel="Phone Number" />
                                            <FormInput
                                                id="phone_number"
                                                type="tel"
                                                placeholder="639XXXXXXXXX"
                                                value={registerForm.data.phone_number}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Allow only numbers and limit to 12 characters
                                                    const digitsOnly = value.replace(/[^0-9]/g, '');
                                                    if (digitsOnly.length <= 12) {
                                                        registerForm.setData('phone_number', digitsOnly);
                                                    }
                                                }}
                                                onFocus={(e) => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                                                message={registerForm.errors.phone_number}
                                                required
                                                maxLength={12}  // Changed to 12
                                                pattern="639[0-9]{9}"  // Pattern for 639 format
                                                className="w-full"
                                            />
                                        </FormInputField>

                                        {/* Barangay Dropdown */}
                                        <FormInputField>
                                            <FormLabel htmlFor="barangay" textLabel="Purok" />
                                            <select
                                                id="barangay"
                                                value={registerForm.data.barangay}
                                                onChange={(e) => registerForm.setData('barangay', e.target.value)}
                                                onFocus={(e) => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                                                className="w-full rounded-lg border border-gray-300 p-2 focus:border-green-600 focus:outline-none"
                                                required
                                            >
                                                <option value="">Select Purok</option>
                                                {barangays.map((barangay: any) => (
                                                    <option key={barangay.id} value={barangay.name}>
                                                        {barangay.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormInputField>

                                        {/* Password */}
                                        <FormInputField>
                                            <FormLabel htmlFor="password" textLabel="Password" />
                                            <FormInput
                                                id="password"
                                                type="password"
                                                placeholder="********"
                                                value={registerForm.data.password}
                                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                                onFocus={(e) => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                                                message={registerForm.errors.password}
                                                required
                                                className="w-full"
                                            />
                                        </FormInputField>

                                        <FormInputField>
                                            <FormLabel htmlFor="password_confirmation" textLabel="Confirm Password" />
                                            <FormInput
                                                id="password_confirmation"
                                                type="password"
                                                placeholder="********"
                                                value={registerForm.data.password_confirmation}
                                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                                onFocus={(e) => (e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                                                message={registerForm.errors.password_confirmation}
                                                required
                                                className="w-full"
                                            />
                                        </FormInputField>
                                    </div>

                                    {/* Submit & switch - kept outside scroll area so it's always visible */}
                                    <FormInputField>
                                        <FormButton className="mt-3 w-full" submit="Sign Up" />
                                        <p className="mt-4 text-center text-sm">
                                            Already have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(true)}
                                                className="text-blue-600 underline"
                                            >
                                                Login
                                            </button>
                                        </p>
                                    </FormInputField>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;