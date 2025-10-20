//insertar todos los fetch

export async function infoUsuario(mail) {
    return fetch(`http://localhost:4000/traerDatosUsuarios?nombre=${mail}`)
        .then(response => response.json())
        .then(result => {
            return result;
        });
}

export async function loguearUsuario(nombre, contraseña) {
    return fetch(`http://localhost:4000/ingresarUsuario?nombre=${nombre}&contraseña=${contraseña}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}


export async function registrarUsuario(formData) {

    return fetch(`http://localhost:4000/insertarUsuario`, {
        method: "POST",
        body: formData //No se necesitan headers porque el formData ya los incluye
    }
    )

        .then(response => response.json())
        .then(result => {
            console.log(result)
            return { result }
        }
        )
}

export async function agregarAmigo(id, id_envio){
    return fetch(`http://localhost:4000/insertarAmigos`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            id2: id_envio
        })
    })
    .then((response) => response.json())
    .then((result) => {
        return { result };
    });
}

export async function traerAmigos(id){
        return fetch(`http://localhost:4000/traerAmigos?id=${id}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function traerSolicitudes(id){
    return fetch(`http://localhost:4000/traerSolicitudes?id=${id}`)
    .then((response) => response.json())
    .then((result) => {
        return { result };
    });
}

export async function enviarSolicitud(id, id_envio){
    return fetch(`http://localhost:4000/insertarSolicitud`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            id_envio: id_envio
        })
    })
    .then((response) => response.json())
    .then((result) => {
        return { result };
    });
}


export async function eliminarSolicitud(id_solicitud){
    return fetch(`http://localhost:4000/eliminarSolicitud`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_solicitud: id_solicitud
        })
    })
    .then((response) => response.json())
    .then((result) => {
        return { result };
    });
}

