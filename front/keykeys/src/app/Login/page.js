"use client"

import ImagenClick from '@/Components/ImagenClick';
import styles from "./login.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
import { loguearUsuario } from "@/API/fetch";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link"


export default function Home() {

  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()

  function ingresoNombre(event) {
    setNombre(event.target.value)
  }
  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  function volver(){
    router.push("/")
  }

  async function checkLogin() {
    if (contraseña == "" || nombre == "") {
      alert("faltan rellenar campos")
    } else {
      let respond = await loguearUsuario(nombre, contraseña) //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
      typeof (respond.result.id == "string") && (respond.result.id = parseInt(respond.result.id))
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

  }

  return (
    <>
      <div className={styles.container}>
        <ImagenClick src = {"/volver.png"} onClick={volver} className={styles.imagenClick}></ImagenClick>
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
        <div className={styles.containerLinks}>
          <Link href="/Registro" className={styles.irALaOtraPagina}>Registrarse</Link>
        </div>
      </div>
    </>
  );
}