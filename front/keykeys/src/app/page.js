"use client"

import styles from "./page.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
import {loguearUsuario} from "@/API/fetch";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";


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

  function directionRegister() {
      router.push('/Registro', { scroll: true })
  }

  async function checkLogin() {
    if (contraseña == "" || nombre == "") {
      alert("faltan rellenar campos")
    } else {
      let respond = await loguearUsuario(nombre, contraseña) //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
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
      <div className={styles.card}>
      <h1 className={clsx(styles.title)}>ChatApp</h1>
      <h2 className={clsx(
        {[styles.subtitle]: true,}
        )
        }>Inicie sesión</h2 >
      <h3 className= {clsx({
        [styles.subtitle2]: true,
      })}>Ingrese su nombre y contraseña</h3>
      <div className={clsx(styles.container)}>
      <Input placeholder="Ingrese su nombre" id="nombre" onChange={ingresoNombre} className={clsx({
        [styles.input]: true,
      })}> </Input>
      <Input placeholder="Ingrese su contraseña" id="contraseña" onChange={ingresoContraseña} className={clsx(styles.input)} type = "password"
      > </Input>
      <a href="#" onClick={directionRegister}> Registrarse</a>
      <Button type="button" onClick={checkLogin} text={"Iniciar sesion"} className={styles.button}> </Button>
      </div>
      </div>
      </div>
  </>
  );
}