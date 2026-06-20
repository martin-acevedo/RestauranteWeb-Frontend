export async function findAllCategoryApi(token){
    try{
        const res = await fetch(`http://localhost:8090/categoria`,{
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

export async function saveCategoryApi(json, token){
    try{
        const res = await fetch(`http://localhost:8090/categoria`,{
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

export async function editCategoryApi(id, json, token){
    try{
        const res = await fetch(`http://localhost:8090/categoria/${id}`,{
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

export async function deleteCategoryApi(id, token){
    try{
        const res = await fetch(`http://localhost:8090/categoria/${id}`,{
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
