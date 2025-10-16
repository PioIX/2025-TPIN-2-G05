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

