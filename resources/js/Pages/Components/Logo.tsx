interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
    altText?: string;
}

const Logo = ({ className, width, height, altText }: LogoProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={width}
            height={height}
            className={className}
            aria-label={altText}
            role="img"
        >
            <g data-name="Recycle Bin">
                <path d="M64 170.667h384L426.667 448A42.667 42.667 0 0 1 384 490.667H128A42.667 42.667 0 0 1 85.333 448z" fill="#30bf00" />
                <rect x="85.333" y="170.667" width="234.667" height="64" rx="32" ry="32" fill="#009c13" />
                <path
                    d="M133.525 218.425c-.549 0-1.103.022-1.659.064a21.334 21.334 0 0 0-19.637 22.869l2.446 31.792a21.335 21.335 0 0 0 21.247 19.698q.824 0 1.66-.064a21.333 21.333 0 0 0 19.634-22.907l-3.273-42.54a21.334 21.334 0 0 0-21.248-19.699z"
                    fill="#8ae963"
                />
                <path
                    d="M426.667 448 448 170.667H320L298.667 448A42.667 42.667 0 0 1 256 490.667h128A42.667 42.667 0 0 0 426.667 448z"
                    fill="#009c13"
                />
                <path
                    d="M458.667 128H448v-.002A106.665 106.665 0 0 0 341.335 21.333h-170.67A106.665 106.665 0 0 0 64 127.998V128H53.333a32 32 0 0 0 0 64h405.334a32 32 0 1 0 0-64z"
                    fill="#47cd1c"
                />
            </g>
        </svg>
    );
};

export default Logo;
