import { customFetch } from "./index";

export async function findAllPlatosApi(token){
    try{
        const res = await customFetch(`http://localhost:8090/plato`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        if (!res) return null;
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function findDisponiblesPlatosApi(token){
    try{
        const res = await customFetch(`http://localhost:8090/plato/disponible`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        if (!res) return null;
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function savePlatoApi(json, token){
    try{
        const res = await customFetch(`http://localhost:8090/plato`,{
            method:"POST",
            body:JSON.stringify(json),
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        if (!res) return null;
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function editPlatoApi(id, json, token){
    try{
        const res = await customFetch(`http://localhost:8090/plato/${id}`,{
            method:"PUT",
            body:JSON.stringify(json),
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        if (!res) return null;
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function deletePlatoApi(id, token){
    try{
        const res = await customFetch(`http://localhost:8090/plato/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        if (!res) return null;
        if (res.ok) return true;
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}
