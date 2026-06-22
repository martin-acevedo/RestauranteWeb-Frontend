import './Select.css';

function Select({
    id,
    label,
    value,
    onChange,
    options = [],
    className = '',
    style,
    children,
    ...props
}) {
    return (
        <div className={`form-group ${className}`} style={style}>
            {label && <label className="form-label" htmlFor={id}>{label}</label>}
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="form-control form-select"
                {...props}
            >
                {children ? children : (
                    options.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
}

export default Select;
