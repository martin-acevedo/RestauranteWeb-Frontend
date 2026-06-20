import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllCategoryApi, saveCategoryApi, editCategoryApi, deleteCategoryApi } from "../../api/categoriaApi";
import { AuthContext } from "../../store/auth-context";
import { jwtDecode } from "jwt-decode";

function CategoriaPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [nombre, setNombre] = useState("");
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Decode role
    const decoded = token ? jwtDecode(token) : null;
    const userRole = decoded?.sub.split("#")[2] || "";
    const isAdmin = userRole === "ROLE_Administrador";

    async function loadCategories() {
        const data = await findAllCategoryApi(token);
        if (data) {
            setCategories(data);
        }
    }

    useEffect(() => {
        if (token) {
            loadCategories();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!nombre.trim()) {
            setError("El nombre de la categoría es obligatorio");
            return;
        }

        const payload = { nombre: nombre.trim() };
        let res;

        if (editId) {
            res = await editCategoryApi(editId, payload, token);
        } else {
            res = await saveCategoryApi(payload, token);
        }

        if (res && !res.status) {
            setSuccess(editId ? "Categoría actualizada con éxito" : "Categoría creada con éxito");
            setNombre("");
            setEditId(null);
            loadCategories();
        } else {
            setError(res?.message || "Ocurrió un error al guardar la categoría");
        }
    };

    const handleEdit = (category) => {
        setNombre(category.nombre);
        setEditId(category.id);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
            setError("");
            setSuccess("");
            const res = await deleteCategoryApi(id, token);
            if (res === true) {
                setSuccess("Categoría eliminada con éxito");
                loadCategories();
            } else {
                setError(res?.message || "No se pudo eliminar la categoría");
            }
        }
    };

    const handleCancel = () => {
        setNombre("");
        setEditId(null);
        setError("");
        setSuccess("");
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h2 className="app-title">Categorías del Menú</h2>
                <button className="app-btn app-btn-secondary" onClick={() => navigate('/menu', { replace: true })}>
                    Volver al Menú
                </button>
            </div>

            {error && <div className="app-badge app-badge-danger" style={{ marginBottom: "16px", display: "block" }}>{error}</div>}
            {success && <div className="app-badge app-badge-success" style={{ marginBottom: "16px", display: "block" }}>{success}</div>}

            {isAdmin && (
                <div className="app-card">
                    <h3>{editId ? "Editar Categoría" : "Nueva Categoría"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="nombreCategoria">Nombre de la Categoría</label>
                            <input
                                id="nombreCategoria"
                                className="form-control"
                                type="text"
                                placeholder="Ej: Entradas, Fondos, Postres, Bebestibles"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className="app-btn app-btn-primary" type="submit">
                                {editId ? "Actualizar" : "Crear"}
                            </button>
                            {editId && (
                                <button className="app-btn app-btn-secondary" type="button" onClick={handleCancel}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="app-table-container">
                <table className="app-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            {isAdmin && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>{cat.id}</td>
                                    <td>{cat.nombre}</td>
                                    {isAdmin && (
                                        <td>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button
                                                    className="app-btn app-btn-secondary"
                                                    style={{ padding: "6px 12px", fontSize: "13px" }}
                                                    onClick={() => handleEdit(cat)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="app-btn app-btn-danger"
                                                    style={{ padding: "6px 12px", fontSize: "13px" }}
                                                    onClick={() => handleDelete(cat.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 3 : 2} style={{ textAlign: "center" }}>No hay categorías disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoriaPage;