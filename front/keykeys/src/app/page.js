"use client"

import ImagenClick from '../Components/ImagenClick';
import { useRouter } from 'next/navigation'


export default function Home(){
    const router=useRouter()
    //si les paso, por ej onClick=router(ruta) en ImagenClick, se ejecuta solo al iniciar la pag. por eso hago 3 distintos
    function home(){
        router.push("/Home")
    }
    function creditos(){
        router.push("/Creditos")
    }
    function iniciarSesion(){
        router.push("/Login")
    }


    return(
        <div>
            <h1>Key Keys</h1>
            <p>Un juego de conocimiento sobre el lenguaje.</p>
            <p>10 segundos para pensar una palabra cada vez mas<br/>larga que la del rival.</p>
            <p>¿Podrás demostrar que sos el hispanohablante definitivo?</p>
            <ImagenClick onClick={home} src={"/next.png"}/>
            <ImagenClick onClick={creditos} src={"/creditos.png"}/>
            <ImagenClick onClick={iniciarSesion} src={"/sesion.png"}/>
        </div>

    )
}