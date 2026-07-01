export async function loginApi(payload){
    try{
        const res = await fetch(`http://localhost:8090/auth/login`,{
            method:"POST",
            body:JSON.stringify(payload),
            headers:{
                "Content-Type":"application/json"
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

export async function createApi(payload){
    try{
        const res = await fetch(`http://localhost:8090/auth/create`,{
            method:"POST",
            body:JSON.stringify(payload),
            headers:{
                "Content-Type":"application/json"
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

export async function customFetch(url, options) {
    try {
        const res = await fetch(url, options);
        if (res && res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
            return null;
        }
        return res;
    } catch (error) {
        console.error("Fetch API error:", error);
        throw error;
    }
}