import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findDisponiblesPlatosApi } from "../../api/platoApi";
import { findAllCategoryApi } from "../../api/categoriaApi";
import { AuthContext } from "../../store/auth-context";

function ConsultaMenuPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    
    const [categories, setCategories] = useState([]);
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadMenu() {
        setLoading(true);
        const platosData = await findDisponiblesPlatosApi(token);
        const categoriesData = await findAllCategoryApi(token);
        
        if (platosData) {
            setPlatos(platosData);
        }
        if (categoriesData) {
            setCategories(categoriesData);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (token) {
            loadMenu();
        }
    }, [token]);

    // Group available plates by category ID
    const getPlatosByCategory = (categoryId) => {
        return platos.filter(p => p.idCategoria === categoryId);
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <div>
                    <h2 className="app-title" style={{ background: "linear-gradient(to right, #10b981, #3b82f6)" }}>
                        Menú del Día (Disponible)
                    </h2>
                    <p style={{ fontSize: "14px", marginTop: "4px" }}>Consulta rápida de platos activos para atención</p>
                </div>
                <button className="app-btn app-btn-secondary" onClick={() => navigate('/menu', { replace: true })}>
                    Volver al Menú
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>Cargando menú...</div>
            ) : (
                <div>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => {
                            const categoryPlatos = getPlatosByCategory(category.id);
                            if (categoryPlatos.length === 0) return null; // Hide categories without available plates

                            return (
                                <div key={category.id} className="menu-group">
                                    <h3 className="menu-group-title">{category.nombre}</h3>
                                    <div className="menu-grid">
                                        {categoryPlatos.map((plato) => (
                                            <div key={plato.id} className="menu-item-card">
                                                <div>
                                                    <div className="menu-item-header">
                                                        <span className="menu-item-name">{plato.nombre}</span>
                                                        <span className="menu-item-price">${plato.precio}</span>
                                                    </div>
                                                    <p className="menu-item-desc">{plato.descripcion}</p>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <span className="app-badge app-badge-success">Disponible</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px" }}>No hay categorías configuradas en el sistema.</div>
                    )}

                    {!loading && platos.length === 0 && (
                        <div className="app-card" style={{ textAlign: "center", padding: "40px" }}>
                            <h3>Menú Vacío</h3>
                            <p>Actualmente no hay ningún plato marcado como disponible en el sistema.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConsultaMenuPage;
