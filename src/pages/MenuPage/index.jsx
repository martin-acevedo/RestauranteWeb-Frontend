import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../store/auth-context"
import { jwtDecode } from "jwt-decode"


function MenuPage(){
    const navigate = useNavigate()
    const {logout, token} = useContext(AuthContext)

    const [name, setName] = useState(token?jwtDecode(token)?.sub.split('#')[1]:'');
    const [rol, setRol] = useState(token?jwtDecode(token)?.sub.split('#')[2]:'');

    const isAdmin = rol === "ROLE_Administrador";

    const salir = ()=>{
        logout();
        navigate('/', {replace:true})
    }

    return (
        <div className="app-container" style={{ maxWidth: "600px", marginTop: "40px" }}>
            <div className="app-card" style={{ padding: "32px", textAlign: "center" }}>
                <h2 style={{ marginBottom: "8px", fontSize: "24px" }}>Bienvenido, {name}</h2>
                <span className="app-badge app-badge-info" style={{ marginBottom: "32px", textTransform: "uppercase" }}>
                    Rol: {rol.replace("ROLE_", "")}
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                    {isAdmin ? (
                        <>
                            <button className="app-btn app-btn-primary" onClick={() => navigate('/categoria')}>
                                Gestionar Categorías
                            </button>
                            <button className="app-btn app-btn-primary" onClick={() => navigate('/platos')}>
                                Gestionar Platos (Menú)
                            </button>
                            <button className="app-btn app-btn-primary" onClick={() => navigate('/mesas')}>
                                Gestionar Mesas del Local
                            </button>
                            <button className="app-btn app-btn-secondary" onClick={() => navigate('/consulta-menu')}>
                                Vista Consulta de Menú
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="app-btn app-btn-primary" onClick={() => navigate('/consulta-menu')}>
                                Consultar Menú Disponible
                            </button>
                            <button className="app-btn app-btn-secondary" onClick={() => navigate('/categoria')}>
                                Consultar Categorías
                            </button>
                        </>
                    )}
                </div>

                <button className="app-btn app-btn-danger" style={{ width: "100%" }} onClick={salir}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

export default MenuPage