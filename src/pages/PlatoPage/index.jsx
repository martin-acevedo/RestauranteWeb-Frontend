import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllPlatosApi, savePlatoApi, editPlatoApi, deletePlatoApi } from "../../api/platoApi";
import { findAllCategoryApi } from "../../api/categoriaApi";
import { AuthContext } from "../../store/auth-context";
import { PageHeader, Alert, Card, Input, Select, Textarea, Button, Table, Badge, SearchBar } from "../../components";
import "./PlatoPage.css";

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
    const [searchTerm, setSearchTerm] = useState("");

    async function loadData() {
        const platosData = await findAllPlatosApi(token);
        if (platosData) {
            setPlatos(platosData);
        }
        
        const categoriesData = await findAllCategoryApi(token);
        if (categoriesData) {
            setCategories(categoriesData);
            if (categoriesData.length > 0 && !idCategoria) {
                setIdCategoria(categoriesData[0].id.toString());
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

        if (res && !res.code && !res.status) {
            setSuccess(editId ? "Plato actualizado con éxito" : "Plato creado con éxito");
            resetForm();
            loadData();
        } else {
            setError(res?.message || "Ocurrió un error al guardar la plato");
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

    // Filter platos by search term
    const filteredPlatos = platos.filter((plato) =>
        plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plato.descripcion && plato.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plato.nombreCategoria && plato.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="app-container">
            <PageHeader
                title="Gestión de Platos"
                actions={
                    <Button variant="secondary" onClick={() => navigate('/menu', { replace: true })}>
                        Volver al Menú
                    </Button>
                }
            />

            <Alert type="danger" message={error} />
            <Alert type="success" message={success} />

            <Card title={editId ? "Editar Plato" : "Nuevo Plato"}>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <Input
                            id="nombrePlato"
                            label="Nombre del Plato"
                            type="text"
                            placeholder="Ej: Pastel de choclo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <Input
                            id="precioPlato"
                            label="Precio ($)"
                            type="number"
                            placeholder="Ej: 8500"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <Select
                            id="categoriaPlato"
                            label="Categoría"
                            value={idCategoria}
                            onChange={(e) => setIdCategoria(e.target.value)}
                        >
                            <option value="" disabled>Seleccione una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </Select>
                        <div className="checkbox-container-fix">
                            <Input
                                id="disponiblePlato"
                                label="Disponible para el público"
                                type="checkbox"
                                checked={disponible}
                                onChange={(e) => setDisponible(e.target.checked)}
                            />
                        </div>
                    </div>

                    <Textarea
                        id="descPlato"
                        label="Descripción"
                        rows="3"
                        placeholder="Breve descripción de los ingredientes o preparación..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />

                    <div className="plato-form-actions">
                        <Button type="submit" variant="primary">
                            {editId ? "Actualizar" : "Crear"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCancel}>
                            {editId ? "Cancelar" : "Limpiar"}
                        </Button>
                    </div>
                </form>
            </Card>

            <div className="plato-search-container">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar platos por nombre, descripción o categoría..."
                />
            </div>

            <Table headers={["Nombre", "Descripción", "Precio", "Categoría", "Estado", "Acciones"]}>
                {filteredPlatos.length > 0 ? (
                    filteredPlatos.map((plato) => (
                        <tr key={plato.id}>
                            <td><strong>{plato.nombre}</strong></td>
                            <td>{plato.descripcion}</td>
                            <td>${plato.precio}</td>
                            <td>{plato.nombreCategoria}</td>
                            <td>
                                <Badge type={plato.disponible ? "success" : "danger"}>
                                    {plato.disponible ? "Disponible" : "Agotado"}
                                </Badge>
                            </td>
                            <td>
                                <div className="plato-table-actions">
                                    <Button
                                        variant="secondary"
                                        style={{ padding: "6px 12px", fontSize: "13px" }}
                                        onClick={() => handleEdit(plato)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        style={{ padding: "6px 12px", fontSize: "13px" }}
                                        onClick={() => handleDelete(plato.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                            {platos.length === 0 ? "No hay platos registrados" : "No se encontraron platos coincidentes"}
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}

export default PlatoPage;
