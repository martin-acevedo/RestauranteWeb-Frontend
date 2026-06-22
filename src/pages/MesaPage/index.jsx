import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllMesasApi, saveMesaApi, editMesaApi, deleteMesaApi } from "../../api/mesaApi";
import { AuthContext } from "../../store/auth-context";
import { PageHeader, Alert, Card, Input, Select, Button, Table, Badge, SearchBar } from "../../components";
import "./MesaPage.css";

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
    const [searchTerm, setSearchTerm] = useState("");

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

    const getBadgeType = (status) => {
        switch (status) {
            case "libre":
                return "success";
            case "ocupada":
                return "danger";
            case "reservada":
                return "info";
            default:
                return "info";
        }
    };

    // Filter mesas based on search term
    const filteredMesas = mesas.filter((mesa) =>
        mesa.numero.toString().includes(searchTerm) ||
        mesa.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mesa.capacidad.toString().includes(searchTerm)
    );

    return (
        <div className="app-container">
            <PageHeader
                title="Gestión de Mesas"
                actions={
                    <Button variant="secondary" onClick={() => navigate('/menu', { replace: true })}>
                        Volver al Menú
                    </Button>
                }
            />

            <Alert type="danger" message={error} />
            <Alert type="success" message={success} />

            <Card title={editId ? "Editar Mesa" : "Nueva Mesa"}>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <Input
                            id="numMesa"
                            label="Número de Mesa"
                            type="number"
                            placeholder="Ej: 5"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                        <Input
                            id="capMesa"
                            label="Capacidad (Personas)"
                            type="number"
                            placeholder="Ej: 4"
                            value={capacidad}
                            onChange={(e) => setCapacidad(e.target.value)}
                        />
                        <Select
                            id="estMesa"
                            label="Estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            options={[
                                { value: "libre", label: "Libre" },
                                { value: "ocupada", label: "Ocupada" },
                                { value: "reservada", label: "Reservada" }
                            ]}
                        />
                    </div>

                    <div className="mesa-form-actions">
                        <Button type="submit" variant="primary">
                            {editId ? "Actualizar" : "Crear"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            {editId ? "Cancelar" : "Limpiar"}
                        </Button>
                    </div>
                </form>
            </Card>

            <div className="mesa-search-container">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar mesas por número, capacidad o estado..."
                />
            </div>

            <Table headers={["ID", "Mesa N°", "Capacidad", "Estado", "Acciones"]}>
                {filteredMesas.length > 0 ? (
                    filteredMesas.map((mesa) => (
                        <tr key={mesa.id}>
                            <td>{mesa.id}</td>
                            <td><strong>Mesa {mesa.numero}</strong></td>
                            <td>{mesa.capacidad} personas</td>
                            <td>
                                <Badge type={getBadgeType(mesa.estado)}>
                                    {mesa.estado}
                                </Badge>
                            </td>
                            <td>
                                <div className="mesa-table-actions">
                                    <Button
                                        variant="secondary"
                                        style={{ padding: "6px 12px", fontSize: "13px" }}
                                        onClick={() => handleEdit(mesa)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        style={{ padding: "6px 12px", fontSize: "13px" }}
                                        onClick={() => handleDelete(mesa.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                            {mesas.length === 0 ? "No hay mesas registradas" : "No se encontraron mesas coincidentes"}
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}

export default MesaPage;
