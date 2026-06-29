export async function findAllPedidosApi(token) {
    try {
        const res = await fetch(`http://localhost:8090/pedido`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function findPedidosActivosApi(token) {
    try {
        const res = await fetch(`http://localhost:8090/pedido/activos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function savePedidoApi(json, token) {
    try {
        const res = await fetch(`http://localhost:8090/pedido`, {
            method: "POST",
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function agregarDetallePedidoApi(idPedido, json, token) {
    try {
        const res = await fetch(`http://localhost:8090/pedido/${idPedido}/detalle`, {
            method: "POST",
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function cerrarPedidoApi(idPedido, token) {
    try {
        const res = await fetch(`http://localhost:8090/pedido/${idPedido}/cerrar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function findDetallePedidoApi(idPedido, token) {
    try {
        const res = await fetch(`http://localhost:8090/pedido/${idPedido}/detalle`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}