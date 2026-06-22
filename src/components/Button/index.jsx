import './Button.css';

function Button({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    className = '',
    disabled = false,
    style,
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`app-btn app-btn-${variant} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
