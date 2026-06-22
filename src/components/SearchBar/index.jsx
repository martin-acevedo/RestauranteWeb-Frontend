import './SearchBar.css';

function SearchBar({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = '',
    style
}) {
    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={`app-search-bar ${className}`} style={style}>
            <span className="search-icon">🔍</span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
            {value && (
                <button type="button" className="search-clear-btn" onClick={handleClear} title="Limpiar búsqueda">
                    ✕
                </button>
            )}
        </div>
    );
}

export default SearchBar;
