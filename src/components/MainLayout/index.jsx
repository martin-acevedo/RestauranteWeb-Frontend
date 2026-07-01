import { useContext, useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { jwtDecode } from "jwt-decode";
import Badge from "../Badge";
import "./MainLayout.css";

function MainLayout() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Decode token safely
    let name = "";
    let role = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            name = decoded?.sub.split("#")[1] || "";
            role = decoded?.sub.split("#")[2] || "";
        } catch (e) {
            console.error("Error decoding token in MainLayout:", e);
        }
    }

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isAdmin = role === "ROLE_ADMIN";
    const roleLabel = role === "ROLE_ADMIN" ? "Administrador" : role === "ROLE_USER" ? "Mesero" : role.replace("ROLE_", "");

    const navItems = isAdmin
        ? [
            { to: "/menu", label: "Inicio", icon: "home" },
            { to: "/categoria", label: "Categorías", icon: "folder" },
            { to: "/platos", label: "Platos", icon: "utensils" },
            { to: "/mesas", label: "Mesas", icon: "table" },
            { to: "/pedidos", label: "Pedidos", icon: "clipboard" },
            { to: "/consulta-menu", label: "Consultar Menú", icon: "search" },
        ]
        : [
            { to: "/menu", label: "Inicio", icon: "home" },
            { to: "/consulta-menu", label: "Consultar Menú", icon: "search" },
            { to: "/pedidos", label: "Tomar Pedidos", icon: "clipboard" },
            { to: "/categoria", label: "Categorías", icon: "folder" },
        ];

    const getIcon = (icon) => {
        switch (icon) {
            case "home":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                );
            case "folder":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                );
            case "utensils":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                        <path d="M7 2v20"></path>
                        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path>
                    </svg>
                );
            case "table":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                    </svg>
                );
            case "clipboard":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                );
            case "search":
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="layout-container">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
                <div className="sidebar-header">
                    <Link to="/menu" className="sidebar-logo">
                        <span className="sidebar-logo-icon">🍽️</span>
                        <span className="sidebar-logo-text">Gourmet</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <span className="sidebar-nav-label">Navegación</span>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? "sidebar-nav-item--active" : ""}`
                            }
                        >
                            <span className="sidebar-nav-icon">{getIcon(item.icon)}</span>
                            <span className="sidebar-nav-label-text">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{name}</span>
                            <Badge type="info" className="sidebar-user-badge">
                                {roleLabel}
                            </Badge>
                        </div>
                    </div>
                    <button className="sidebar-logout-btn" onClick={handleLogout} title="Cerrar Sesión">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span className="sidebar-logout-text">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="layout-main">
                {/* Mobile top bar */}
                <header className="mobile-topbar">
                    <button
                        className="hamburger-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Abrir menú"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <span className="mobile-topbar-title">🍽️ Gourmet</span>
                </header>

                <main className="layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
