//insertar todos los fetch


//API API API API API API API API API API API API API API API API API
export async function checkearPalabra(palabra){
        return fetch(`https://rae-api.com/api/words/${palabra}`)
        .then(response => response.json())
        .then(result => {
            return result.ok;
        });
}
//API API API API API API API API API API API API API API API API API



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

