import { useContext, useState } from "react";
import { createApi, loginApi } from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";

function LoginPage(){
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate();
    const {saveToken} = useContext(AuthContext)

    const loginAction = async()=>{
        console.log('login')
        const resp = await loginApi({rut:rut, password:password})
        console.log(resp)
        if(resp?.token){
            await saveToken(resp.token)
            navigate('/menu', {replace:true})
        }else if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    }
const createAction = async()=>{
        console.log('login')
        const resp = await createApi({rut:rut, password:password, name:name, idRol:1})
        console.log(resp)
        if(resp?.token){
            await saveToken(resp.token)
            navigate('/menu', {replace:true})
        }else if(resp.message){
            alert(resp.message)
        }
        console.log(resp)
    }


    return <>
        <h3>Login</h3>
        <input type="text" onChange={(e)=> setRut(e.target.value)} />
        <input type="password" onChange={(e)=> setPassword(e.target.value)} />
        <button onClick={loginAction}>login</button>

        <hr />
        <h3>Login</h3>
        <input type="text" onChange={(e)=> setRut(e.target.value)} />
        <input type="password" onChange={(e)=> setPassword(e.target.value)} />
        <input type="text" onChange={(e)=> setName(e.target.value)} />
        <button onClick={createAction}>crear</button>

    </>
}

export default LoginPage;