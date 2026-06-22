import './Textarea.css';

function Textarea({
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
    className = '',
    style,
    ...props
}) {
    return (
        <div className={`form-group ${className}`} style={style}>
            {label && <label className="form-label" htmlFor={id}>{label}</label>}
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="form-control form-textarea"
                {...props}
            />
        </div>
    );
}

export default Textarea;
