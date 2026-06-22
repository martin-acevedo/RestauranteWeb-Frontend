import './Alert.css';

function Alert({ type = 'info', message, className = '', style }) {
    if (!message) return null;
    return (
        <div className={`app-alert app-alert-${type} ${className}`} style={style}>
            {message}
        </div>
    );
}

export default Alert;
