import { ReactNode } from 'react';

interface FormInputFieldProps {
    children: ReactNode;
    className?: string;
}

const FormInputField = ({ children, className }: FormInputFieldProps) => {
    return <div className={`mb-4 md:mb-6 ${className}`}>{children}</div>;
};

export default FormInputField;
