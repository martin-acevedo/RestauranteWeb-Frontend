import './Table.css';

function Table({ headers = [], children, className = '', style }) {
    return (
        <div className={`app-table-container ${className}`} style={style}>
            <table className="app-table">
                {headers.length > 0 && (
                    <thead>
                        <tr>
                            {headers.map((header, idx) => (
                                <th key={idx}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
