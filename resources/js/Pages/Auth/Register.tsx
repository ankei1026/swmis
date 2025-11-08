import { Head, Link, useForm } from '@inertiajs/react';
import FormButton from '../Components/FormButton';
import FormInput from '../Components/FormInput';
import FormInputField from '../Components/FormInputField';
import FormLabel from '../Components/FormLabel';
import Logo from '../Components/Logo';

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleSignup = (): void => {
        return;
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-10">
            <Head title="Sign Up" />
            <div className="hidden h-full w-full items-center justify-center rounded-lg border border-black bg-green-100 md:flex">
                <img src="/assets/Solid Waste.png" alt="" />
            </div>
            <div className="flex h-full w-full items-center justify-center">
                <div className="w-full max-w-md p-6">
                    <Logo width={100} height={100} className="mx-auto" altText="App Logo" />
                    <h1 className="mb-6 text-center text-4xl font-bold">SWMIS</h1>
                    <h2 className="mb-4 text-start font-sans text-2xl">Hey There!</h2>
                    <p className="text-m mb-6">Sign Up to access the dashboard and help the community better one step at the time.</p>
                    <form action="#">
                        <FormInputField>
                            <FormLabel htmlFor={'name'} textLabel={'Name'} />
                            <FormInput
                                id={'name'}
                                type={'text'}
                                placeholder={'Juan Der'}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                message={errors.name}
                                required={true}
                                className="w-full"
                            />
                        </FormInputField>
                        <FormInputField>
                            <FormLabel htmlFor={'email'} textLabel={'Email'} />
                            <FormInput
                                id={'email'}
                                type={'email'}
                                placeholder={'example@email.com'}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                message={errors.email}
                                required={true}
                                className="w-full"
                            />
                        </FormInputField>
                        <FormInputField>
                            <FormLabel htmlFor={'password'} textLabel={'Password'} />
                            <FormInput
                                id={'password'}
                                type={'password'}
                                placeholder={'********'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required={true}
                                message={errors.password}
                                className="w-full"
                            />
                        </FormInputField>
                        <FormInputField>
                            <FormButton className="mt-2" submit={'Sign up'} onClick={handleSignup} />
                            <p className="mt-4 text-center text-sm">
                                Already have an account? <span> </span>
                                <Link href={'/auth/login'} className="text-blue-600 underline">
                                    Login{' '}
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
