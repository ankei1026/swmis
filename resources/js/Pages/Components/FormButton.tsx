interface FormButtonProps {
    submit: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const FormButton = ({ submit, className, onClick }: FormButtonProps) => {
    return (
        <div className="w-full">
            <button
                type="submit"
                onClick={onClick}
                className={`${className ?? ''} w-full cursor-pointer rounded-md border border-black bg-green-100 px-2 py-2 text-black hover:shadow-md`}
            >
                {submit}
            </button>
        </div>
    );
};

export default FormButton;
