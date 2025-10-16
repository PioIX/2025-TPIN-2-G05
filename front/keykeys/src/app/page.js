"use client"


import styles from "./page.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
import { loguearUsuario } from "@/API/fetch";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link"

  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()

  function ingresoNombre(event) {
    setNombre(event.target.value)
  }
  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  async function checkLogin() {
    if (contraseña == "" || nombre == "") {
      alert("faltan rellenar campos")
    } else {
      let respond = await loguearUsuario(nombre, contraseña) //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
      typeof(respond.result.id == "string")&& (respond.result.id = parseInt(respond.result.id))
      switch (respond.result.id) {
        case -2:
          alert("Contraseña no coincide, reingrese")
          break
        case -1:
          alert("Usuario inexistente, reingrese")
          break
        default:
          localStorage.setItem("chatAPPId_user", respond.result.id)
          alert("Ingresando...")
          router.replace('/Home', { scroll: false })
          break
      }

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
            <ImagenClick onClick={home} src={"/next.png"}/> {/*ESTO SE SACA CUANDO FUNCIONE LOGIN*/}
            <ImagenClick onClick={creditos} src={"/creditos.png"}/> {/*ey ey ey*/}
            <ImagenClick onClick={iniciarSesion} src={"/sesion.png"}/>
        </div>

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Keykeys</h1>
        <h2 className={styles.subtitle}>Inicie sesión</h2 >
        <h3 className={styles.subtitle2}>Ingrese su nombre y contraseña</h3>
        <div className={styles.containerInputs}>
          <Input placeholder="Ingrese su nombre..." id="nombre" onChange={ingresoNombre} classNameInput={styles.input} classNameInputWrapper={styles.inputWrapper}> </Input>
          <Input placeholder="Ingrese su contraseña..." id="contraseña" onChange={ingresoContraseña} classNameInput={styles.input} classNameInputWrapper={styles.inputWrapper} type="password"
          > </Input>
        </div>

        <Button type="button" onClick={checkLogin} text={"Iniciar sesion"} className={styles.button}> </Button>
        <h4 className={styles.subtitle3}>¿No tiene cuenta? Registrarse ahora</h4>
        <Link href="/Registro" className={styles.irALaOtraPagina}>Registrarse</Link>
      </div>
    </>
  );
}