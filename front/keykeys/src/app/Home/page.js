"use client"

import Volver from '@/Components/Volver'

export default function Home(){
    return(
        <div>
            <h1>Home</h1>

            <div id="menuLateral">
                <img/>          {/*<--- ACÁ VÁ LA IMÁGEN DEL USUARIO*/}
                <h3></h3>       {/*<--- ACÁ VÁ EL NOMBRE DEL USUARIO*/}

                <h3>Amigos</h3>
                <div id="menuAmigos"></div> {/*<--- ACÁ VAN LOS AMIGOS*/}
            </div>

            

            <div id="menuJuego">
                <Button text="Unirse a la sala"/>
                <Button text="Crear una sala"/>
                <Button text="Configuración"/>
            </div>

            <div id=""/>
            <Volver/>
        </div>
    )
}