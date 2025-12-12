import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Leaf, LocationEditIcon, Recycle, ShieldCheck, Shield, FileText, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthModal from './Auth/AuthModal';
import FullCalendarComponent from '@/Pages/Components/FullCalendar'

export default function LandingPage() {
    const [showAuth, setShowAuth] = useState(false);
    const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

    const { props } = usePage<{
        barangays?: { id: number; name: string }[];
        successCount?: number
        schedules?: any[];
    }>();

    const barangays = props.barangays ?? [];
    const successCount = props.successCount ?? [];
    const schedules = props.schedules ?? [];

    // Check if user has accepted privacy notice
    useEffect(() => {
        const hasAcceptedPrivacy = localStorage.getItem('dataPrivacyAccepted');
        if (!hasAcceptedPrivacy) {
            // Show after a short delay on first visit
            const timer = setTimeout(() => {
                setShowPrivacyNotice(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptPrivacy = () => {
        localStorage.setItem('dataPrivacyAccepted', 'true');
        setShowPrivacyNotice(false);
    };

    const handleAccessSystem = () => {
        const hasAcceptedPrivacy = localStorage.getItem('dataPrivacyAccepted');
        if (!hasAcceptedPrivacy) {
            setShowPrivacyNotice(true);
        } else {
            setShowAuth(true);
        }
    };

    return (
        <div>
            <Head title="Solid Waste Management Information System" />
            <div className="flex flex-col items-center justify-center overflow-x-hidden text-gray-800">
                {/* Hero Section */}
                <section className="relative flex min-h-[100vh] w-full flex-col items-center justify-center bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl font-bold md:text-6xl">
                            Solid Waste Management for a Cleaner Tomorrow
                        </h1>
                        <p className="mt-4 text-lg text-green-50 md:text-xl">
                            Empowering cities with real-time data, analytics, and sustainable collection strategies.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <a
                                href="#features"
                                className="rounded-full bg-white px-6 py-3 font-semibold text-green-700 shadow-md transition hover:bg-green-100"
                            >
                                Learn More
                            </a>

                            {/* ✅ Button that opens Auth Modal after privacy check */}
                            <button
                                onClick={handleAccessSystem}
                                className="rounded-full border border-white px-6 py-3 font-semibold text-white hover:bg-green-700/30"
                            >
                                Access System
                            </button>
                        </div>
                    </motion.div>
                    <motion.img
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        src="https://cdn-icons-png.flaticon.com/512/3082/3082031.png"
                        alt="Waste Management Illustration"
                        className="mt-12 h-48 w-48 md:h-64 md:w-64"
                    />
                </section>

                {/* Features Section */}
                <section id="features" className="w-full bg-gray-50 py-20">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
                            Transforming Waste Management with Data
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Our system helps municipalities and companies make informed, sustainable decisions.
                        </p>

                        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                {
                                    icon: <BarChart3 className="text-green-600" size={40} />,
                                    title: 'Data-Driven Insights',
                                    text: 'Analytics for successful waste collection.',
                                },
                                {
                                    icon: <Recycle className="text-green-600" size={40} />,
                                    title: 'Sustainability Tracking',
                                    text: 'Monitor recycling rates and carbon reduction performance over time.',
                                },
                                {
                                    icon: <Globe className="text-green-600" size={40} />,
                                    title: 'Smart City Integration',
                                    text: 'Apply web-based digitalization in municipal management tools.',
                                },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                    }}
                                    className="rounded-xl border border-black bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                                    <p className="mt-2 text-gray-600">{feature.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Impact Metrics */}
                <section className="w-full bg-white py-20">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">Our Environmental Impact</h2>
                        <p className="mt-4 text-gray-600">Every collection contributes to a cleaner planet.</p>
                        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                {
                                    icon: <Leaf className="text-green-600" />,
                                    value: successCount,
                                    label: 'Waste Collection Success',
                                },
                                {
                                    icon: <ShieldCheck className="text-green-600" />,
                                    value: '98%',
                                    label: 'System Reliability',
                                },
                                {
                                    icon: <LocationEditIcon className="text-green-600" />,
                                    value: barangays.length,
                                    label: 'Purok Served',
                                },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                    }}
                                    className="flex flex-col items-center justify-center rounded-xl border border-black p-6 shadow-sm"
                                >
                                    <div className="mb-3">{stat.icon}</div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-gray-500">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FullCalendar Section */}
                <section className="w-full h-40vh px-8 md:px-16 lg:px-46 py-20 bg-gray-50">
                    <h2 className="text-3xl font-bold text-gray-800 md:text-4xl text-center mb-6">
                        Waste Collection Schedule Calendar
                    </h2>
                    {/* Pass schedules to FullCalendarComponent */}
                    <FullCalendarComponent schedules={schedules} />
                </section>

                {/* Developers Section */}
                <section className="w-full bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-20 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="mx-auto max-w-6xl px-6"
                    >
                        <h2 className="text-3xl font-bold md:text-4xl">Meet the Developers</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-green-100">
                            Our dedicated team of developers is committed to creating innovative and sustainable digital
                            solutions for smarter waste management.
                        </p>

                        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-1 lg:grid-cols-2">
                            {[
                                { name: 'Ianne Dave Obal', role: 'Lead Developer', image: '/assets/Ian.jpg' },
                                { name: 'Franklin Badilla', role: 'Frontend Engineer', image: '/assets/Franklin.jpg' },
                                { name: 'Vincent Kelly Veracion', role: 'Backend Developer', image: '/assets/Vincent.jpg' },
                                { name: 'Zyon Suarez', role: 'Backend Developer', image: '/assets/Zyon.jpg' },
                            ].map((developer, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                    }}
                                    className="group relative overflow-hidden rounded-2xl border border-black bg-white/10 p-6 text-center backdrop-blur-sm transition hover:bg-white/20"
                                >
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={developer.image}
                                            alt={developer.name}
                                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md transition group-hover:scale-105"
                                        />
                                        <h3 className="mt-4 text-xl font-semibold text-white">{developer.name}</h3>
                                        <p className="text-green-100">{developer.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="w-full bg-gray-900 py-8 text-center text-gray-400">
                    <p>
                        © {new Date().getFullYear()} Solid Waste Management Information System. All rights reserved.
                    </p>
                </footer>
            </div>

            {/* ✅ Auth Modal */}
            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} barangays={props.barangays} />
            
            {/* ✅ Data Privacy Act Modal */}
            {showPrivacyNotice && (
                <div className="fixed inset-0 overflow-y-auto">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
                    
                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                            {/* Modal Header */}
                            <div className="bg-green-600 px-6 py-4 text-white">
                                <div className="flex items-center">
                                    <Shield className="mr-3 h-6 w-6" />
                                    <h3 className="text-xl font-bold">
                                        Data Privacy Act Notice
                                    </h3>
                                </div>
                                <p className="mt-1 text-green-100 text-sm">
                                    Republic Act No. 10173 - Data Privacy Act of 2012
                                </p>
                            </div>
                            
                            {/* Modal Body with Scroll */}
                            <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <FileText className="mr-3 mt-1 h-5 w-5 text-green-600 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Privacy Notice</h4>
                                            <p className="text-gray-600 text-sm">
                                                Welcome to the Solid Waste Management Information System. We are committed to protecting your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-3">Information We Collect:</h4>
                                        <ul className="text-gray-700 text-sm space-y-2">
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 mr-2"></div>
                                                <span>Personal identification information (name, email, contact details)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 mr-2"></div>
                                                <span>Barangay/Purok information for service allocation</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 mr-2"></div>
                                                <span>System usage data for improvement purposes</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 mr-2"></div>
                                                <span>Collection schedules, complaints, and operational data</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Purpose of Data Collection:</h4>
                                        <p className="text-gray-600 text-sm">
                                            Your data is collected solely for the purpose of providing efficient waste management services, scheduling collections, and improving system functionality..
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Your Rights:</h4>
                                        <p className="text-gray-600 text-sm mb-3">
                                            Under the Data Privacy Act, you have the right to:
                                        </p>
                                        <ul className="text-gray-700 text-sm space-y-1 ml-4">
                                            <li className="list-disc">Access your personal information</li>
                                            <li className="list-disc">Correct inaccurate or incomplete data</li>
                                            <li className="list-disc">Request deletion of your data (subject to legal requirements)</li>
                                            <li className="list-disc">Object to the processing of your personal data</li>
                                            <li className="list-disc">Lodge a complaint with the National Privacy Commission</li>
                                        </ul>
                                    </div>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                                        <h4 className="font-semibold text-yellow-800 mb-2">Important Notice:</h4>
                                        <p className="text-yellow-700 text-sm">
                                            By clicking "I Accept", you acknowledge that you have read, understood, and agree to the terms of this Privacy Notice. You consent to the collection, processing, and storage of your personal information for the purposes stated above.
                                        </p>
                                    </div>

                                    <div className="flex items-center text-gray-600 text-sm">
                                        <input
                                            type="checkbox"
                                            id="privacyCheckbox"
                                            className="mr-2 h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                        />
                                        <label htmlFor="privacyCheckbox">
                                            I have read and understood the Data Privacy Act Notice
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                                <button
                                    onClick={() => {
                                        // Option: Redirect away or keep on page
                                        window.location.href = 'https://www.privacy.gov.ph';
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                                >
                                    Learn More About Data Privacy
                                </button>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            // User can choose to leave if they don't accept
                                            alert('You must accept the Data Privacy Notice to use this system.');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={handleAcceptPrivacy}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        I Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}