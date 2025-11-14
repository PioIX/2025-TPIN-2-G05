//insertar todos los fetch
import { cargarListado } from "@/API/cargarListado";

export async function palabraExiste(palabra) {
    const letra = palabra.trim().toLowerCase()[0];
    const listado = await cargarListado(letra);
    const p = palabra.trim().toLowerCase();

    return listado.some(item => item.toLowerCase() === p);
}

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

export async function infoUsuarioPartida(id) {//trae todo del usuario menos contraseña
    return fetch(`http://localhost:4000/traerDatosUsuariosParaJuego?id=${id}`)
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

export async function desactivarUsuario(username) {
    console.log("Se entró al fetch")
    return fetch(`http://localhost:4000/desactivarUsuario`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function activarUsuario(username) {
    console.log("Se entró al fetch")
    return fetch(`http://localhost:4000/activarUsuario`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function editUser(newUsername, oldUsername) {
    console.log("Se entró al fetch")
    return fetch(`http://localhost:4000/modificarUsuario`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newUsername: newUsername,
            oldUsername: oldUsername
        })
    })
        .then((response) => response.json())
        .then((result) => {
            return { result };
        });
}

export async function actualizarDatosUsuario(formData) {
    return fetch(`http://localhost:4000/cambiarDatosUsuario`, {
        method: "PUT",
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            return { result }
        }
        )
}

