import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { jwtDecode } from "jwt-decode";
import { Button, Card, Badge } from "../../components";
import "./MenuPage.css";

function MenuPage() {
    const navigate = useNavigate();
    const { logout, token } = useContext(AuthContext);

    const [name] = useState(token ? jwtDecode(token)?.sub.split('#')[1] : '');
    const [rol] = useState(token ? jwtDecode(token)?.sub.split('#')[2] : '');

    const isAdmin = rol === "ROLE_Administrador";

    const salir = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <div className="menu-page-container">
            <Card className="menu-card">
                <h2 className="welcome-title">Bienvenido, {name}</h2>
                <Badge type="info" className="role-badge">
                    Rol: {rol.replace("ROLE_", "")}
                </Badge>

                <div className="menu-actions-list">
                    {isAdmin ? (
                        <>
                            <Button variant="primary" onClick={() => navigate('/categoria')}>
                                Gestionar Categorías
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/platos')}>
                                Gestionar Platos (Menú)
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/mesas')}>
                                Gestionar Mesas del Local
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/pedidos')}>
                                Gestionar Pedidos
                            </Button>
                            <Button variant="secondary" onClick={() => navigate('/consulta-menu')}>
                                Vista Consulta de Menú
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" onClick={() => navigate('/consulta-menu')}>
                                Consultar Menú Disponible
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/pedidos')}>
                                Tomar Pedidos
                            </Button>
                            <Button variant="secondary" onClick={() => navigate('/categoria')}>
                                Consultar Categorías
                            </Button>
                        </>
                    )}
                </div>

                <Button variant="danger" className="logout-btn" onClick={salir}>
                    Cerrar Sesión
                </Button>
            </Card>
        </div>
    );
}

export default MenuPage;