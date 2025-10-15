//insertar todos los fetch

export async function infoUsuario(mail) {
    return fetch(`http://localhost:4000/traerDatosUsuarios?nombre=${mail}`)
        .then(response => response.json())
        .then(result => {
            return result; 
        });
}

export async function loguearUsuario(mail, contraseña) {
  let datos = {
    mail: mail,
    contraseña: contraseña,
  };
  return fetch(`http://localhost:4000/ingresarUsuario`, {
    method: "POST",
    body: JSON.stringify(datos),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      return { result };
    });
}


export async function registrarUsuario(nombre, contraseña, foto) {
    let datos = {
        nombre: nombre,
        contraseña: contraseña,
        foto: foto
    }
    return fetch(`http://localhost:4000/insertarUsuario`,{
        method: "POST",
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json",
            },})
    
        .then(response => response.json())
        .then(result => {
            console.log(result)
            return { result }
        }
        )
}

