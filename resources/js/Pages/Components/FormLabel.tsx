interface FormLabelProp {
    htmlFor: string;
    textLabel: string;
    className?: string;
}

const FormLabel = ({ htmlFor, textLabel, className }: FormLabelProp) => {
    return (
        <label htmlFor={htmlFor} className={`${className ?? ''} text-sm font-bold`}>
            {textLabel}
        </label>
    );
};

export default FormLabel;
