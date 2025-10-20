"use client"

import Button from '@/Components/Button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ImagenClick from '@/Components/ImagenClick'
import { traerFotoUsuario } from '@/API/fetch'

export default function Home() {
    const [idUser, setIdUser] = useState(0)
    const [image, setImage] = useState("")


    useEffect(()=>{
        console.log("IMAGEN DEL USUARIO EN HOME: ", image)
    }, [image])

    useEffect(() => {
        let id = localStorage.getItem("idUser")
        console.log("ID DEL USUARIO EN HOME: ", id)
        setIdUser(id)
        fetchFotoUsuario(id) // <-- le pasamos el id directamente
    }, [])

async function fetchFotoUsuario(id) {
    console.log(id)
    let respond = await traerFotoUsuario(id)
    const bytes = respond.result.foto[0].foto.data; // Array de bytes obtenido de la base de datos

    // Se convierte el buffer a base64 con el objeto Buffer para poder renderizar la imagen, son los numeros que representan la imagen
    const base64 = Buffer.from(bytes).toString("base64"); //Lo pasa a un string entendible para renderizarlo

    // Se crea la data URl, que es el formato que usa HTML para representar imágenes
    
    const dataUrl = `data:image/png;base64,${base64}`; //Pense que el mymetype podia complicar las cosas al representar la imagen, pero no es el caso

    // Guardar el data URL en el estado
    setImage(dataUrl);
}
    const router = useRouter()

    function logOut() {
        router.replace("../")
    }

    function showUnirseSala() {
        console.log("Mostrando el modal de unirse a sala")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showCrearSala() {
        console.log("Mostrando el modal de crear sala")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showConfiguracion() {
        console.log("Mostrando el modal de configuracion")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showAgregarAmigos() {
        console.log("Mostrando el modal de agregar amigos")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showSolicitudes() {
        console.log("Mostrando el modal las solicitudes de amistad")//<---ACÁ SE MUESTRA EL MODAL
    }



    return (
        <div>
            <div id="menuLateral">
                {image != "data:image/png;base64," ? <ImagenClick src={image}></ImagenClick> : <ImagenClick src={"/sesion.png"}></ImagenClick>} {/*<--- ACÁ VÁ LA IMÁGEN DEL USUARIO*/}
                <h3></h3>       {/*<--- ACÁ VÁ EL NOMBRE DEL USUARIO*/}
                <Button text="Cerrar Sesión" onClick={logOut} />
                <ImagenClick onClick={showSolicitudes} src={"/notificacion.png"} />

                <h3>Amigos</h3>
                <div id="menuAmigos"></div> {/*<--- ACÁ VAN LOS AMIGOS*/}
                <Button text="Agregar" onClick={showAgregarAmigos} />

            </div>

            <div id="menuJuego">
                <h1>KEY KEYS</h1>
                <Button text="Unirse a la sala" onClick={showUnirseSala} />
                <Button text="Crear una sala" onClick={showCrearSala} />
                <Button text="Configuración" onClick={showConfiguracion} />
            </div>

            <div id="" />
        </div>
    )
}