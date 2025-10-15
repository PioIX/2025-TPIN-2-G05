"use client"

import Input from "@/Components/Input";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/app/page.module.css";
import { registrarUsuario } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE

export default function Home() {

  const [image, setImage] = useState("");
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()

  function ingresoNombre(event) {
    setNombre(event.target.value)
  }

  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  
  async function checkRegister() {
    console.log( contraseña, nombre, image)
    let respond = await registrarUsuario(contraseña, nombre, image)//REEMPLAZAR CON EL FETCH CORRESPONDIENTE
    console.log(respond)
    if (respond == -1) {
      alert("Usuario existente, reingrese")
    } else {
      console.log(respond.res[0].id_usuario)

      localStorage.setItem("chatAPPId_user", respond.res[0].id_usuario)
      alert("Ingresando...")
      router.replace('../Home', { scroll: false })
    }
  }

  function directionLogin() {
    router.push('/', { scroll: true })
  }

  return (
    <>
      <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title} >ChatApp</h1>
        <h2 className={styles.subtitle}>Registro</h2>
        <h3 className={styles.subtitle2}>Ingrese un nombre y contraseña</h3>
        <div className={styles.container}>
          <Input placeholder="Ingrese su nombre" id="nombre" onChange={ingresoNombre} className={styles.input}></Input>
          <Input placeholder="Ingrese su nueva contraseña" id="contraseña" onChange={ingresoContraseña} className={styles.input} type = "password"></Input>
          <a href="#" onClick={directionLogin}> Iniciar Sesion</a>
          <Button type="button" onClick={checkRegister} text={"Registrarse"} className={styles.button}> </Button>
      </div>
      </div>
      </div>
    </>
  );
}