import { useContext, useEffect, useState } from "react";
import { createApi, loginApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { Button, Input, Card, Alert, Select } from "../../components";
import "./LoginPage.css";

function LoginPage() {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [idRol, setIdRol] = useState("1");
    
    const navigate = useNavigate();
    const { token, saveToken } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            navigate('/menu', { replace: true });
        }
    }, [token, navigate]);

    const handleTabChange = (loginTab) => {
        setIsLogin(loginTab);
        setError('');
        setSuccess('');
        setRut('');
        setPassword('');
        setName('');
        setIdRol("1");
    };

    const loginAction = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');

        if (!rut.trim() || !password.trim()) {
            setError('Por favor complete todos los campos');
            return;
        }

        const resp = await loginApi({ rut: rut.trim(), password: password.trim() });
        if (resp?.token) {
            await saveToken(resp.token);
            navigate('/menu', { replace: true });
        } else {
            setError(resp?.message || 'Error de credenciales, intente nuevamente');
        }
    };

    const createAction = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');

        if (!rut.trim() || !password.trim() || !name.trim()) {
            setError('Por favor complete todos los campos');
            return;
        }

        const resp = await createApi({ rut: rut.trim(), password: password.trim(), name: name.trim(), idRol: parseInt(idRol) });
        if (resp && !resp.code && !resp.status) {
            const loginResp = await loginApi({ rut: rut.trim(), password: password.trim() });
            if (loginResp?.token) {
                setSuccess('Usuario creado exitosamente. Iniciando sesión...');
                setTimeout(async () => {
                    await saveToken(loginResp.token);
                    navigate('/menu', { replace: true });
                }, 1500);
            } else {
                setError('Usuario creado, pero no se pudo iniciar sesión automáticamente. Ingrese sus credenciales.');
            }
        } else {
            setError(resp?.message || 'Error al crear la cuenta. Intente nuevamente');
        }
    };

    return (
        <div className="login-page-container">
            <Card className="login-card">
                <div className="login-logo">RestauranteWeb</div>
                <p className="login-subtitle">Sistema de Gestión e Información</p>

                <div className="login-toggle-container">
                    <button
                        type="button"
                        className={`login-toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => handleTabChange(true)}
                    >
                        Ingresar
                    </button>
                    <button
                        type="button"
                        className={`login-toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => handleTabChange(false)}
                    >
                        Registrarse
                    </button>
                </div>

                <Alert type="danger" message={error} />
                <Alert type="success" message={success} />

                {isLogin ? (
                    <form onSubmit={loginAction} className="login-form">
                        <Input
                            id="rut-login"
                            label="RUT"
                            type="text"
                            placeholder="Ej: 12345678-9"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                        />
                        <Input
                            id="password-login"
                            label="Contraseña"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="login-btn-submit" variant="primary">
                            Iniciar Sesión
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={createAction} className="login-form">
                        <Input
                            id="name-register"
                            label="Nombre Completo"
                            type="text"
                            placeholder="Ej: Juan Pérez"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            id="rut-register"
                            label="RUT"
                            type="text"
                            placeholder="Ej: 12345678-9"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            required
                        />
                        <Input
                            id="password-register"
                            label="Contraseña"
                            type="password"
                            placeholder="Cree una contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Select
                            id="role-register"
                            label="Rol de Usuario"
                            value={idRol}
                            onChange={(e) => setIdRol(e.target.value)}
                            options={[
                                { value: "1", label: "Administrador" },
                                { value: "2", label: "Mesero" }
                            ]}
                        />
                        <Button type="submit" className="login-btn-submit" variant="success">
                            Crear Cuenta
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}

export default LoginPage;