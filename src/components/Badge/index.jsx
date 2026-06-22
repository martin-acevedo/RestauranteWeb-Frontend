import './Badge.css';

function Badge({ type = 'info', children, className = '', style }) {
    return (
        <span className={`app-badge app-badge-${type} ${className}`} style={style}>
            {children}
        </span>
    );
}

export default Badge;
