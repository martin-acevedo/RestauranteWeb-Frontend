import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllMesasApi, saveMesaApi, editMesaApi, deleteMesaApi } from "../../api/mesaApi";
import { AuthContext } from "../../store/auth-context";

function MesaPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    
    const [mesas, setMesas] = useState([]);
    
    // Form fields
    const [numero, setNumero] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [estado, setEstado] = useState("libre");
    
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadMesas() {
        const data = await findAllMesasApi(token);
        if (data) {
            setMesas(data);
        }
    }

    useEffect(() => {
        if (token) {
            loadMesas();
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!numero || isNaN(numero) || parseInt(numero) <= 0) {
            setError("El número de mesa debe ser un número entero mayor a 0");
            return;
        }
        if (!capacidad || isNaN(capacidad) || parseInt(capacidad) <= 0) {
            setError("La capacidad debe ser un número entero mayor a 0");
            return;
        }

        const payload = {
            numero: parseInt(numero),
            capacidad: parseInt(capacidad),
            estado
        };

        let res;
        if (editId) {
            res = await editMesaApi(editId, payload, token);
        } else {
            res = await saveMesaApi(payload, token);
        }

        if (res && !res.status) {
            setSuccess(editId ? "Mesa actualizada con éxito" : "Mesa creada con éxito");
            resetForm();
            loadMesas();
        } else {
            setError(res?.message || "Ocurrió un error al guardar la mesa");
        }
    };

    const handleEdit = (mesa) => {
        setNumero(mesa.numero.toString());
        setCapacidad(mesa.capacidad.toString());
        setEstado(mesa.estado);
        setEditId(mesa.id);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta mesa?")) {
            setError("");
            setSuccess("");
            const res = await deleteMesaApi(id, token);
            if (res === true) {
                setSuccess("Mesa eliminada con éxito");
                loadMesas();
            } else {
                setError(res?.message || "No se pudo eliminar la mesa");
            }
        }
    };

    const resetForm = () => {
        setNumero("");
        setCapacidad("");
        setEstado("libre");
        setEditId(null);
    };

    const handleCancel = () => {
        resetForm();
        setError("");
        setSuccess("");
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case "libre":
                return "app-badge-success";
            case "ocupada":
                return "app-badge-danger";
            case "reservada":
                return "app-badge-info";
            default:
                return "";
        }
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h2 className="app-title">Gestión de Mesas</h2>
                <button className="app-btn app-btn-secondary" onClick={() => navigate('/menu', { replace: true })}>
                    Volver al Menú
                </button>
            </div>

            {error && <div className="app-badge app-badge-danger" style={{ marginBottom: "16px", display: "block" }}>{error}</div>}
            {success && <div className="app-badge app-badge-success" style={{ marginBottom: "16px", display: "block" }}>{success}</div>}

            <div className="app-card">
                <h3>{editId ? "Editar Mesa" : "Nueva Mesa"}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="numMesa">Número de Mesa</label>
                            <input
                                id="numMesa"
                                className="form-control"
                                type="number"
                                placeholder="Ej: 5"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="capMesa">Capacidad (Personas)</label>
                            <input
                                id="capMesa"
                                className="form-control"
                                type="number"
                                placeholder="Ej: 4"
                                value={capacidad}
                                onChange={(e) => setCapacidad(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="estMesa">Estado</label>
                            <select
                                id="estMesa"
                                className="form-control"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="libre">Libre</option>
                                <option value="ocupada">Ocupada</option>
                                <option value="reservada">Reservada</option>
                            </select>
                        </div>
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
                            <th>ID</th>
                            <th>Mesa N°</th>
                            <th>Capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mesas && mesas.length > 0 ? (
                            mesas.map((mesa) => (
                                <tr key={mesa.id}>
                                    <td>{mesa.id}</td>
                                    <td><strong>Mesa {mesa.numero}</strong></td>
                                    <td>{mesa.capacidad} personas</td>
                                    <td>
                                        <span className={`app-badge ${getBadgeClass(mesa.estado)}`}>
                                            {mesa.estado.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                className="app-btn app-btn-secondary"
                                                style={{ padding: "6px 12px", fontSize: "13px" }}
                                                onClick={() => handleEdit(mesa)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="app-btn app-btn-danger"
                                                style={{ padding: "6px 12px", fontSize: "13px" }}
                                                onClick={() => handleDelete(mesa.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>No hay mesas registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MesaPage;
