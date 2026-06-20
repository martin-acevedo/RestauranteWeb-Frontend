import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllPlatosApi, savePlatoApi, editPlatoApi, deletePlatoApi } from "../../api/platoApi";
import { findAllCategoryApi } from "../../api/categoriaApi";
import { AuthContext } from "../../store/auth-context";

function PlatoPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    
    const [platos, setPlatos] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Form fields
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [disponible, setDisponible] = useState(true);
    const [idCategoria, setIdCategoria] = useState("");
    
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadData() {
        const platosData = await findAllPlatosApi(token);
        if (platosData) {
            setPlatos(platosData);
        }
        
        const categoriesData = await findAllCategoryApi(token);
        if (categoriesData) {
            setCategories(categoriesData);
            if (categoriesData.length > 0 && !idCategoria) {
                setIdCategoria(categoriesData[0].id);
            }
        }
    }

    useEffect(() => {
        if (token) {
            loadData();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!nombre.trim()) {
            setError("El nombre del plato es obligatorio");
            return;
        }
        if (!precio || isNaN(precio) || parseInt(precio) <= 0) {
            setError("El precio debe ser un número mayor a 0");
            return;
        }
        if (!idCategoria) {
            setError("Debe seleccionar una categoría");
            return;
        }

        const payload = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: parseInt(precio),
            disponible,
            idCategoria: parseInt(idCategoria)
        };

        let res;
        if (editId) {
            res = await editPlatoApi(editId, payload, token);
        } else {
            res = await savePlatoApi(payload, token);
        }

        if (res && !res.status) {
            setSuccess(editId ? "Plato actualizado con éxito" : "Plato creado con éxito");
            resetForm();
            loadData();
        } else {
            setError(res?.message || "Ocurrió un error al guardar el plato");
        }
    };

    const handleEdit = (plato) => {
        setNombre(plato.nombre);
        setDescripcion(plato.descripcion || "");
        setPrecio(plato.precio.toString());
        setDisponible(plato.disponible);
        setIdCategoria(plato.idCategoria.toString());
        setEditId(plato.id);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este plato?")) {
            setError("");
            setSuccess("");
            const res = await deletePlatoApi(id, token);
            if (res === true) {
                setSuccess("Plato eliminado con éxito");
                loadData();
            } else {
                setError(res?.message || "No se pudo eliminar el plato");
            }
        }
    };

    const resetForm = () => {
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setDisponible(true);
        if (categories.length > 0) {
            setIdCategoria(categories[0].id.toString());
        }
        setEditId(null);
    };

    const handleCancel = () => {
        resetForm();
        setError("");
        setSuccess("");
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h2 className="app-title">Gestión de Platos</h2>
                <button className="app-btn app-btn-secondary" onClick={() => navigate('/menu', { replace: true })}>
                    Volver al Menú
                </button>
            </div>

            {error && <div className="app-badge app-badge-danger" style={{ marginBottom: "16px", display: "block" }}>{error}</div>}
            {success && <div className="app-badge app-badge-success" style={{ marginBottom: "16px", display: "block" }}>{success}</div>}

            <div className="app-card">
                <h3>{editId ? "Editar Plato" : "Nuevo Plato"}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="nombrePlato">Nombre del Plato</label>
                            <input
                                id="nombrePlato"
                                className="form-control"
                                type="text"
                                placeholder="Ej: Pastel de choclo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="precioPlato">Precio ($)</label>
                            <input
                                id="precioPlato"
                                className="form-control"
                                type="number"
                                placeholder="Ej: 8500"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="categoriaPlato">Categoría</label>
                            <select
                                id="categoriaPlato"
                                className="form-control"
                                value={idCategoria}
                                onChange={(e) => setIdCategoria(e.target.value)}
                            >
                                <option value="" disabled>Seleccione una categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ justifyContent: "center" }}>
                            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={disponible}
                                    onChange={(e) => setDisponible(e.target.checked)}
                                    style={{ transform: "scale(1.2)" }}
                                />
                                Disponible para el público
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="descPlato">Descripción</label>
                        <textarea
                            id="descPlato"
                            className="form-control"
                            rows="3"
                            placeholder="Breve descripción de los ingredientes o preparación..."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button className="app-btn app-btn-primary" type="submit">
                            {editId ? "Actualizar" : "Crear"}
                        </button>
                        <button className="app-btn app-btn-secondary" type="button" onClick={handleCancel}>
                            {editId ? "Cancelar" : "Limpiar"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="app-table-container">
                <table className="app-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {platos && platos.length > 0 ? (
                            platos.map((plato) => (
                                <tr key={plato.id}>
                                    <td><strong>{plato.nombre}</strong></td>
                                    <td>{plato.descripcion}</td>
                                    <td>${plato.precio}</td>
                                    <td>{plato.nombreCategoria}</td>
                                    <td>
                                        <span className={`app-badge ${plato.disponible ? 'app-badge-success' : 'app-badge-danger'}`}>
                                            {plato.disponible ? "Disponible" : "Agotado"}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                className="app-btn app-btn-secondary"
                                                style={{ padding: "6px 12px", fontSize: "13px" }}
                                                onClick={() => handleEdit(plato)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="app-btn app-btn-danger"
                                                style={{ padding: "6px 12px", fontSize: "13px" }}
                                                onClick={() => handleDelete(plato.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>No hay platos registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlatoPage;
