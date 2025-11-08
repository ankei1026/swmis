import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Leaf, Recycle, ShieldCheck, Users } from 'lucide-react';
import { useState } from 'react';
import AuthModal from './Auth/AuthModal';

export default function LandingPage() {
    const [showAuth, setShowAuth] = useState(false);

    const { props } = usePage<{ barangays?: { id: number; name: string }[] }>();
    const barangays = props.barangays ?? [];

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

                            {/* ✅ Button that opens Auth Modal */}
                            <button
                                onClick={() => setShowAuth(true)}
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
                                    value: '25K+',
                                    label: 'Tons Collected',
                                },
                                {
                                    icon: <ShieldCheck className="text-green-600" />,
                                    value: '98%',
                                    label: 'System Reliability',
                                },
                                {
                                    icon: <Users className="text-green-600" />,
                                    value: barangays.length,
                                    label: 'Barangays Served',
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

            {/* ✅ Auth Modal (Rendered outside main layout) */}
            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} barangays={props.barangays} />
        </div>
    );
}
