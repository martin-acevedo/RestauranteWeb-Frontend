import './Card.css';

function Card({ children, title, className = '', style, ...props }) {
    return (
        <div className={`app-card ${className}`} style={style} {...props}>
            {title && <h3 className="app-card-title">{title}</h3>}
            {children}
        </div>
    );
}

export default Card;
