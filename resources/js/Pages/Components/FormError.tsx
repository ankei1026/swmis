interface FormErrorProps {
    message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
    return <p className="mt-1 text-sm text-red-600">{message}</p>;
};

export default FormError;
