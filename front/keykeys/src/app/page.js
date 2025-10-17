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
      <ImagenClick onClick={home} src={"/next.png"} />
      <ImagenClick onClick={creditos} src={"/creditos.png"} />
      <ImagenClick onClick={iniciarSesion} src={"/sesion.png"} />
    </div>
  )
}
// return (
//   <>
//     <div className={styles.container}>
//       <h1 className={styles.title}>Keykeys</h1>
//       <h2 className={styles.subtitle}>Inicie sesión</h2 >
//       <h3 className={styles.subtitle2}>Ingrese su nombre y contraseña</h3>
//       <div className={styles.containerInputs}>
//         <Input placeholder="Ingrese su nombre..." id="nombre" onChange={ingresoNombre} classNameInput={styles.input} classNameInputWrapper={styles.inputWrapper}> </Input>
//         <Input placeholder="Ingrese su contraseña..." id="contraseña" onChange={ingresoContraseña} classNameInput={styles.input} classNameInputWrapper={styles.inputWrapper} type="password"
//         > </Input>
//       </div>

//       <Button type="button" onClick={checkLogin} text={"Iniciar sesion"} className={styles.button}> </Button>
//       <h4 className={styles.subtitle3}>¿No tiene cuenta? Registrarse ahora</h4>
//       <Link href="/Registro" className={styles.irALaOtraPagina}>Registrarse</Link>
//     </div>
//   </>
// );
