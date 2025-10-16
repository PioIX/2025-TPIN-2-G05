"use client"

import Button from '@/Components/Button'
import {useRouter} from 'next/navigation'
import ImagenClick from '@/Components/ImagenClick'

export default function Home(){
    const router=useRouter()

    function logOut(){
        router.replace("../")
    }

    function showUnirseSala(){
        console.log("Mostrando el modal de unirse a sala")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showCrearSala(){
        console.log("Mostrando el modal de crear sala")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showConfiguracion(){
        console.log("Mostrando el modal de configuracion")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showAgregarAmigos(){
        console.log("Mostrando el modal de agregar amigos")//<---ACÁ SE MUESTRA EL MODAL
    }

    function showSolicitudes(){
        console.log("Mostrando el modal las solicitudes de amistad")//<---ACÁ SE MUESTRA EL MODAL
    }

    return(
        <div>
            <div id="menuLateral">
                <img></img>     {/*<--- ACÁ VÁ LA IMÁGEN DEL USUARIO*/}
                <h3></h3>       {/*<--- ACÁ VÁ EL NOMBRE DEL USUARIO*/}
                <Button text="Cerrar Sesión" onClick={logOut}/>
                <ImagenClick onClick={showSolicitudes} src={"/notificacion.png"}/>

                <h3>Amigos</h3>
                <div id="menuAmigos"></div> {/*<--- ACÁ VAN LOS AMIGOS*/}
                <Button text="Agregar" onClick={showAgregarAmigos}/>

            </div>

            <div id="menuJuego">
                <h1>KEY KEYS</h1>
                <Button text="Unirse a la sala" onClick={showUnirseSala}/>
                <Button text="Crear una sala" onClick={showCrearSala}/>
                <Button text="Configuración" onClick={showConfiguracion}/>
            </div>

            <div id=""/>
        </div>
    )
}