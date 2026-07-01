import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { jwtDecode } from "jwt-decode";
import { Card, Button } from "../../components";
import "./MenuPage.css";

function MenuPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [name] = useState(token ? jwtDecode(token)?.sub.split('#')[1] : '');
    const [rol] = useState(token ? jwtDecode(token)?.sub.split('#')[2] : '');

    const isAdmin = rol === "ROLE_ADMIN";

    return (
        <div className="welcome-container">
            <div className="welcome-hero">
                <span className="hero-badge">Portal de Control</span>
                <h1 className="hero-title">Restaurante Gourmet</h1>
                <p className="hero-subtitle">
                    Bienvenido, <strong className="user-highlight">{name}</strong>. Accede rápidamente a los módulos del sistema utilizando el panel de accesos directos o el menú de navegación lateral.
                </p>
            </div>

            <div className="quick-access-section">
                <h3 className="section-title">Accesos Rápidos</h3>
                <div className="quick-access-grid">
                    {isAdmin ? (
                        <>
                            <Card className="action-card" title="📁 Gestión de Categorías">
                                <p className="card-desc">Cree, modifique y elimine las categorías para clasificar los platos del menú del restaurante.</p>
                                <Button variant="primary" onClick={() => navigate('/categoria')}>
                                    Ir a Categorías
                                </Button>
                            </Card>

                            <Card className="action-card" title="🍔 Gestión del Menú (Platos)">
                                <p className="card-desc">Administre la carta del local. Agregue nuevos platos, edite precios y cambie la disponibilidad en tiempo real.</p>
                                <Button variant="primary" onClick={() => navigate('/platos')}>
                                    Ir a Platos
                                </Button>
                            </Card>

                            <Card className="action-card" title="🪑 Gestión de Mesas">
                                <p className="card-desc">Configure la numeración de las mesas del local para el correcto despacho de pedidos.</p>
                                <Button variant="primary" onClick={() => navigate('/mesas')}>
                                    Ir a Mesas
                                </Button>
                            </Card>

                            <Card className="action-card" title="📝 Panel de Pedidos">
                                <p className="card-desc">Monitoree las comandas de cocina, registre pedidos de mesas y realice cierres de cuentas.</p>
                                <Button variant="primary" onClick={() => navigate('/pedidos')}>
                                    Ir a Pedidos
                                </Button>
                            </Card>

                            <Card className="action-card" title="🔍 Consulta de Menú">
                                <p className="card-desc">Visualice rápidamente el catálogo completo de platos disponibles para informar a los comensales.</p>
                                <Button variant="secondary" onClick={() => navigate('/consulta-menu')}>
                                    Ver Consulta
                                </Button>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card className="action-card" title="📝 Tomar Pedidos">
                                <p className="card-desc">Registre de manera directa nuevos pedidos y agregue platos a las comandas de las mesas del local.</p>
                                <Button variant="primary" onClick={() => navigate('/pedidos')}>
                                    Toma de Pedidos
                                </Button>
                            </Card>

                            <Card className="action-card" title="🔍 Consultar Menú">
                                <p className="card-desc">Revise en tiempo real la disponibilidad del menú para responder consultas de los clientes.</p>
                                <Button variant="primary" onClick={() => navigate('/consulta-menu')}>
                                    Ver Catálogo
                                </Button>
                            </Card>

                            <Card className="action-card" title="📁 Consultar Categorías">
                                <p className="card-desc">Visualice la lista de categorías del local para guiar a los clientes en el menú.</p>
                                <Button variant="secondary" onClick={() => navigate('/categoria')}>
                                    Ver Categorías
                                </Button>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MenuPage;