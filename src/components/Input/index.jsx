import './Input.css';

function Input({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    style,
    checked,
    ...props
}) {
    if (type === 'checkbox') {
        return (
            <div className={`form-group-checkbox ${className}`} style={style}>
                <label className="form-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        className="form-checkbox-control"
                        {...props}
                    />
                    {label}
                </label>
            </div>
        );
    }

    return (
        <div className={`form-group ${className}`} style={style}>
            {label && <label className="form-label" htmlFor={id}>{label}</label>}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="form-control"
                {...props}
            />
        </div>
    );
}

export default Input;
