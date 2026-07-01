import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { PageHeader, Alert, Card, Select, Button, Table, Input, Badge} from "../../components";
import { findDisponiblesPlatosApi } from "../../api/platoApi";
import { findAllMesasApi } from "../../api/mesaApi";
import {
    findAllPedidosApi,
    findPedidosActivosApi,
    savePedidoApi,
    cerrarPedidoApi,
    agregarDetallePedidoApi,
    findDetallePedidoApi
} from "../../api/pedidoApi";
import "./PedidoPage.css";

function PedidoPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [mesas, setMesas] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [idMesa, setIdMesa] = useState("");

    const [platos, setPlatos] = useState([]);
    const [idPedido, setIdPedido] = useState("");
    const [idPlato, setIdPlato] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [notas, setNotas] = useState("");

    const [detalle, setDetalle] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    const [historial, setHistorial] = useState([]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadData() {
        const mesasData = await findAllMesasApi(token);
        const pedidosData = await findPedidosActivosApi(token);
        const platosData = await findDisponiblesPlatosApi(token);
        const historialData = await findAllPedidosApi(token);
        
        if (historialData) setHistorial(historialData);
        if (platosData) setPlatos(platosData);
        if (mesasData) setMesas(mesasData);
        if (pedidosData) setPedidos(pedidosData);
    }

    useEffect(() => {
        if (token) loadData();
    }, [token]);

    const getPedidoBadge = (estado) => {
        switch (estado) {
            case "activo":
                return "success";
            case "cerrado":
                return "danger";
            default:
                return "info";
        }
    };

    const handleCrearPedido = async () => {
        setError("");
        setSuccess("");

        if (!idMesa) {
            setError("Seleccione una mesa");
            return;
        }

        const res = await savePedidoApi(
            { idMesa: parseInt(idMesa) },
            token
        );

        if (res && !res.code) {
            setSuccess("Pedido creado correctamente");
            setIdMesa("");
            loadData();
        } else {
            setError(res?.message || "Error al crear pedido");
        }
    };

    const handleCerrarPedido = async (id) => {
        setError("");
        setSuccess("");

        const res = await cerrarPedidoApi(id, token);

        if (res && !res.code) {
            setSuccess("Pedido cerrado");
            loadData();
        } else {
            setError(res?.message || "Error al cerrar pedido");
        }
    };

    const handleAgregarDetalle = async () => {
        setError("");
        setSuccess("");

        if (!idPedido || !idPlato || !cantidad) {
            setError("Seleccione pedido, plato y cantidad");
            return;
        }

        if (parseInt(cantidad) <= 0) {
            setError("La cantidad debe ser mayor a 0");
            return;
        }

        const res = await agregarDetallePedidoApi(
            idPedido,
            {
                idPlato: parseInt(idPlato),
                cantidad: parseInt(cantidad),
                notas
            },
            token
        );

        if (res && !res.code) {
            setSuccess("Plato agregado al pedido");
            setIdPedido("");
            setIdPlato("");
            setCantidad("");
            setNotas("");
            loadData();
        } else {
            setError(res?.message || "Error al agregar plato");
        }
    };

    const handleVerDetalle = async (pedido) => {
        const data = await findDetallePedidoApi(pedido.id, token);

        if (data && !data.status) {
            setPedidoSeleccionado(pedido);
            setDetalle(data);
        } else {
            setError(data?.message || "Error al obtener detalle");
        }
    };

    const mesasLibres = mesas.filter(m => m.estado === "libre");

    return (
        <div className="app-container">

            <PageHeader
                title="Gestión de Pedidos"
            />

            <Alert type="danger" message={error} />
            <Alert type="success" message={success} />

            <Card title="Crear Pedido">

                <Select
                    label="Seleccionar Mesa"
                    value={idMesa}
                    onChange={(e) => setIdMesa(e.target.value)}
                    options={[
                        { value: "", label: "Seleccione..." },
                        ...mesasLibres.map(m => ({
                            value: m.id,
                            label: `Mesa ${m.numero}`
                        }))
                    ]}
                />

                <Button
                    variant="primary"
                    onClick={handleCrearPedido}
                >
                    Crear Pedido
                </Button>

            </Card>

            <Card title="Agregar Plato a Pedido">
                <Select
                    label="Pedido Activo"
                    value={idPedido}
                    onChange={(e) => setIdPedido(e.target.value)}
                    options={[
                        { value: "", label: "Seleccione..." },
                        ...pedidos.map(p => ({
                            value: p.id,
                            label: `Pedido #${p.id} - Mesa ${p.idMesa}`
                        }))
                    ]}
                />

                <Select
                    label="Plato"
                    value={idPlato}
                    onChange={(e) => setIdPlato(e.target.value)}
                    options={[
                        { value: "", label: "Seleccione..." },
                        ...platos.map(p => ({
                            value: p.id,
                            label: `${p.nombre} - $${p.precio}`
                        }))
                    ]}
                />

                <Input
                    label="Cantidad"
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Ej: 2"
                />

                <Input
                    label="Notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej: sin cebolla"
                />

                <Button
                    variant="primary"
                    onClick={handleAgregarDetalle}
                >
                    Agregar Plato
                </Button>

            </Card>
            
            <Card title="Pedidos Activos">
                <Table headers={["ID", "Mesa", "Fecha" ,"Estado", "Total", "Acciones"]}>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                            <td>{pedido.id}</td>
                            <td>{pedido.idMesa}</td>
                            <td>{new Date(pedido.fechaPedido).toLocaleString()}</td>
                            <td>
                                <Badge type={getPedidoBadge(pedido.estado)}>
                                    {pedido.estado}
                                </Badge>
                            </td>
                            <td>${pedido.total}</td>
                            <td>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleVerDetalle(pedido)}
                                >
                                    Ver Detalle
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleCerrarPedido(pedido.id)}
                                >
                                    Cerrar Pedido
                                </Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
            <Card title="Histórico de Pedidos">
                <Table headers={["ID", "Mesa", "Fecha", "Estado", "Total", "Acciones"]}>
                    {historial
                        .filter(p => p.estado !== "activo")
                        .map((pedido) => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.idMesa}</td>
                                <td>{new Date(pedido.fechaPedido).toLocaleString()}</td>
                                <td>
                                    <Badge type={getPedidoBadge(pedido.estado)}>
                                        {pedido.estado}
                                    </Badge>
                                </td>
                                <td>${pedido.total}</td>
                                <td>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleVerDetalle(pedido)}
                                    >
                                        Ver Detalle
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </Table>
            </Card>
            {pedidoSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Detalle Pedido #{pedidoSeleccionado.id}</h2>
                            <Button variant="secondary" onClick={() => setPedidoSeleccionado(null)}>
                                Cerrar
                            </Button>
                        </div>

                        <Table headers={["Plato", "Cantidad", "Precio Unitario", "Subtotal", "Notas"]}>
                            {detalle.length > 0 ? (
                                detalle.map((d) => (
                                    <tr key={d.id}>
                                        <td>{d.nombrePlato}</td>
                                        <td>{d.cantidad}</td>
                                        <td>${d.precioUnitario}</td>
                                        <td>${d.subtotal}</td>
                                        <td>{d.notas || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        Este pedido no tiene platos agregados
                                    </td>
                                </tr>
                            )}
                        </Table>
                    </div>
                </div>
            )}

        </div>
    );
}

export default PedidoPage;