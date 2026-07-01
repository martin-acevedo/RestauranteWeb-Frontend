import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findDisponiblesPlatosApi } from "../../api/platoApi";
import { findAllCategoryApi } from "../../api/categoriaApi";
import { AuthContext } from "../../store/auth-context";
import { PageHeader, Badge, Button, Card, SearchBar } from "../../components";
import "./ConsultaMenuPage.css";

function ConsultaMenuPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    
    const [categories, setCategories] = useState([]);
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    // Filter plates based on search term
    const filteredPlatos = platos.filter((plato) =>
        plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plato.descripcion && plato.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Group filtered plates by category ID
    const getPlatosByCategory = (categoryId) => {
        return filteredPlatos.filter(p => p.idCategoria === categoryId);
    };

    return (
        <div className="app-container">
            <PageHeader
                title="Menú del Día (Disponible)"
                subtitle="Consulta rápida de platos activos para atención"
            />

            <div className="consulta-search-container">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar platos por nombre o descripción..."
                />
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>Cargando menú...</div>
            ) : (
                <div>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => {
                            const categoryPlatos = getPlatosByCategory(category.id);
                            if (categoryPlatos.length === 0) return null; // Hide categories without matching plates

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
                                                    <Badge type="success">Disponible</Badge>
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

                    {!loading && filteredPlatos.length === 0 && (
                        <Card style={{ textAlign: "center", padding: "40px" }}>
                            <h3>Menú Vacío</h3>
                            <p>No se encontraron platos que coincidan con la búsqueda o no hay platos marcados como disponibles en el sistema.</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConsultaMenuPage;
