import { Head, Link, router, useForm } from '@inertiajs/react';
import FormButton from '../Components/FormButton';
import FormInput from '../Components/FormInput';
import FormInputField from '../Components/FormInputField';
import FormLabel from '../Components/FormLabel';
import Logo from '../Components/Logo';

const Login = () => {
    const { data, setData, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const { email, password } = data;

        // 🧠 Mock login logic (replace with real API later)
        if (email === 'resident@example.com' && password === 'test1234') {
            router.visit('/resident/dashboard');
        } else if (email === 'admin@example.com' && password === 'test1234') {
            router.visit('/admin/dashboard');
        } else {
            alert('Invalid email or password.');
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-10">
            <Head title="Login" />
            <div className="hidden h-full w-full items-center justify-center rounded-lg border border-black bg-green-100 md:flex">
                <img src="/assets/Solid Waste.png" alt="" />
            </div>

            <div className="flex h-full w-full items-center justify-center">
                <div className="w-full max-w-md p-6">
                    <Logo width={100} height={100} className="mx-auto" altText="App Logo" />
                    <h1 className="mb-6 text-center text-4xl font-bold">SWMIS</h1>
                    <h2 className="mb-4 text-start font-sans text-2xl">Welcome back!</h2>
                    <p className="text-m mb-6">Login to access the dashboard and help the community better one step at a time.</p>

                    <form onSubmit={handleLogin}>
                        <FormInputField>
                            <FormLabel htmlFor="email" textLabel="Email" />
                            <FormInput
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                message={errors.email}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        <FormInputField>
                            <FormLabel htmlFor="password" textLabel="Password" />
                            <FormInput
                                id="password"
                                type="password"
                                placeholder="********"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                message={errors.password}
                                required
                                className="w-full"
                            />
                        </FormInputField>

                        <FormInputField>
                            <FormButton className="mt-2" submit="Login" />
                            <p className="mt-4 text-center text-sm">
                                Don’t have an account?{' '}
                                <Link href="/auth/register" className="text-blue-600 underline">
                                    Sign Up
                                </Link>
                            </p>
                        </FormInputField>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
