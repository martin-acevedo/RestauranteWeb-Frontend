import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findAllCategoryApi, saveCategoryApi, editCategoryApi, deleteCategoryApi } from "../../api/categoriaApi";
import { AuthContext } from "../../store/auth-context";
import { jwtDecode } from "jwt-decode";
import { PageHeader, Alert, Card, Input, Button, Table, SearchBar } from "../../components";
import "./CategoriaPage.css";

function CategoriaPage() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [nombre, setNombre] = useState("");
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Decode role
    const decoded = token ? jwtDecode(token) : null;
    const userRole = decoded?.sub.split("#")[2] || "";
    const isAdmin = userRole === "ROLE_ADMIN";

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

        if (res && !res.code && !res.status) {
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

    // Filter categories by term
    const filteredCategories = categories.filter((cat) =>
        cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.id.toString().includes(searchTerm)
    );

    return (
        <div className="app-container">
            <PageHeader
                title="Categorías del Menú"
                actions={
                    <Button variant="secondary" onClick={() => navigate('/menu', { replace: true })}>
                        Volver al Menú
                    </Button>
                }
            />

            <Alert type="danger" message={error} />
            <Alert type="success" message={success} />

            {isAdmin && (
                <Card title={editId ? "Editar Categoría" : "Nueva Categoría"}>
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="nombreCategoria"
                            label="Nombre de la Categoría"
                            type="text"
                            placeholder="Ej: Entradas, Fondos, Postres, Bebestibles"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <div className="category-form-actions">
                            <Button type="submit" variant="primary">
                                {editId ? "Actualizar" : "Crear"}
                            </Button>
                            {editId && (
                                <Button type="button" variant="secondary" onClick={handleCancel}>
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            )}

            <div className="category-search-container">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar categorías por nombre o ID..."
                />
            </div>

            <Table headers={["ID", "Nombre", isAdmin ? "Acciones" : null].filter(Boolean)}>
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.nombre}</td>
                            {isAdmin && (
                                <td>
                                    <div className="category-table-actions">
                                        <Button
                                            variant="secondary"
                                            style={{ padding: "6px 12px", fontSize: "13px" }}
                                            onClick={() => handleEdit(cat)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            style={{ padding: "6px 12px", fontSize: "13px" }}
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={isAdmin ? 3 : 2} style={{ textAlign: "center" }}>
                            {categories.length === 0 ? "No hay categorías disponibles" : "No se encontraron categorías coincidentes"}
                        </td>
                    </tr>
                )}
            </Table>
        </div>
    );
}

export default CategoriaPage;