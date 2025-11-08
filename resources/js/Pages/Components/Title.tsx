import React, { forwardRef, HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * Main title text. If omitted, children will be rendered.
     */
    title?: string;
    /**
     * Optional subtitle displayed under the h1.
     */
    subtitle?: string | React.ReactNode;
    /**
     * Additional class names to apply to the root h1.
     */
    className?: string;
}

const Title = forwardRef<HTMLHeadingElement, TitleProps>(
    ({ title, children, subtitle, className = "text-2xl font-bold mb-4", ...rest }, ref) => {
        const content = title ?? children;

        return (
            <header>
                <h1
                    ref={ref}
                    className={`title-root ${className}`.trim()}
                    {...rest}
                >
                    {content}
                </h1>
                {subtitle ? (
                    <p className="title-subtitle text-sm" aria-hidden="false">
                        {subtitle}
                    </p>
                ) : null}
            </header>
        );
    }
);

Title.displayName = "Title";

export default Title;