export async function findAllMesasApi(token){
    try{
        const res = await fetch(`http://localhost:8090/mesa`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function saveMesaApi(json, token){
    try{
        const res = await fetch(`http://localhost:8090/mesa`,{
            method:"POST",
            body:JSON.stringify(json),
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function editMesaApi(id, json, token){
    try{
        const res = await fetch(`http://localhost:8090/mesa/${id}`,{
            method:"PUT",
            body:JSON.stringify(json),
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    }catch(error){
        console.log("==START ERROR==")
        console.log(error);
        console.log("===END ERROR==")
        return null;
    }
}

export async function deleteMesaApi(id, token){
    try{
        const res = await fetch(`http://localhost:8090/mesa/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        });
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
