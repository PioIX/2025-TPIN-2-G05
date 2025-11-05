//insertar todos los fetch


//API API API API API API API API API API API API API API API API API
export async function checkearPalabra(palabra) {

    return fetch(`http://localhost:4000/checkearPalabra`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ palabra: palabra })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        });
}
//API API API API API API API API API API API API API API API API API



export async function infoUsuario(id) {
    return fetch(`http://localhost:4000/traerDatosUsuarios?id=${id}`)
        .then(response => response.json())
        .then(result => {
            return result;
        });
}

export async function traerTodosLosUsuarios() {
    return fetch(`http://localhost:4000/traerTodosUsuarios`)
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

export async function traerFotoUsuario(id) {
    return fetch(`http://localhost:4000/traerFotoUsuario?id=${id}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}



export async function registrarUsuario(formData) {

    return fetch(`http://localhost:4000/insertarUsuario`, {
        method: "POST",
        body: formData //No se necesitan headers porque el formData ya los incluye, o por lo menos no necesita los headers de json
    }
    )

        .then(response => response.json())
        .then(result => {
            console.log(result)
            return { result }
        }
        )
}

export async function agregarAmigo(id, id_envio, id_solicitud) {
    return fetch(`http://localhost:4000/insertarAmigos`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            id2: id_envio,
            id_solicitud: id_solicitud
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function traerAmigos(id) {
    return fetch(`http://localhost:4000/traerAmigos?id=${id}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function traerSolicitudes(id) {
    return fetch(`http://localhost:4000/traerSolicitudes?id=${id}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function enviarSolicitud(id, id_envio) {
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


export async function eliminarSolicitud(id_solicitud) {
    return fetch(`http://localhost:4000/eliminarSolicitud`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id_solicitud
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}


export async function crearPartida(id_usuario_admin) {
    return fetch(`http://localhost:4000/crearPartida`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_usuario_admin: id_usuario_admin
        })
    }).then((response) => response.json())
        .then((result) => {
            return { result };
        })
}

// export async function traerPartidasActivas(id){
//     return fetch(`http://localhost:4000/traerPartidasActivas?id=${id}`)
//     .then((response) => response.json())
//     .then((result) => {
//         return { result };
//     });
// }

export async function actualizarValoresPartidaTrue(id_partida, id_usuario_ganador) {
    return fetch(`http://localhost:4000/actualizarValoresPartidaTrue`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_partida: id_partida,
            id_usuario_ganador: id_usuario_ganador
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function actualizarValoresPartidaFalse(id_partida) {
    return fetch(`http://localhost:4000/actualizarValoresPartidaFalse`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_partida: id_partida
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function chequearUsuariosPartida(id_partida) {
    return fetch(`http://localhost:4000/chequearUsuariosPartida?id=${id_partida}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });

}

export async function agregarUsuarioAPartida(id_partida, id_usuario) {
    return fetch(`http://localhost:4000/AgregarUsuarioAPartida`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_partida: id_partida,
            id_usuario: id_usuario
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function traerPartidaPorCodigo(codigo) {
    return fetch(`http://localhost:4000/traerPartidaPorCodigo?codigo=${codigo}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function traerPartidasActivasAmigos(id_usuario) {
    return fetch(`http://localhost:4000/TraerPartidasActivasAmigos?id=${id_usuario}`)
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function traerCodigo(id_partida) {
    return fetch(`http://localhost:4000/traerCodigo?id_partida=${id_partida}`)

        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}
