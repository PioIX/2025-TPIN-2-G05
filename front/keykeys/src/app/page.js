"use client"

import ImagenClick from '../Components/ImagenClick';
import { useRouter } from 'next/navigation'
import styles from "./page.module.css"


export default function Home() {
  const router = useRouter()
  //si les paso, por ej onClick=router(ruta) en ImagenClick, se ejecuta solo al iniciar la pag. por eso hago 3 distintos
  function home() {
    router.push("/Home")
  }
  function creditos() {
    router.push("/Creditos")
  }
  function iniciarSesion() {
    router.push("/Login")
  }


  return (
    <div className = {styles.container}>
      <h1 className = {styles.title}>Key Keys</h1>
      <p className = {styles.red}>Un juego de conocimiento sobre el lenguaje.</p>
      <p className = {styles.rest}>10 segundos para pensar una palabra cada vez mas<br />larga que la del rival.</p>
      <p className={styles.rest}>¿Podrás demostrar que sos el hispanohablante definitivo?</p>
      <div className={styles.center}>
        {/* <ImagenClick onClick={home} src={"/next.png"} /> Que vaya al home?? */}
        <ImagenClick onClick={creditos} src={"/creditos.png"} />
        <ImagenClick onClick={iniciarSesion} src={"/sesion.png"} />
      </div>
    </div>
  )
}