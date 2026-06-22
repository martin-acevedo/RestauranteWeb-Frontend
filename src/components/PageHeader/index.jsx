import './PageHeader.css';

function PageHeader({ title, subtitle, actions, className = '', style }) {
    return (
        <div className={`app-header ${className}`} style={style}>
            <div className="app-header-text">
                <h2 className="app-title">{title}</h2>
                {subtitle && <p className="app-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="app-header-actions">{actions}</div>}
        </div>
    );
}

export default PageHeader;
