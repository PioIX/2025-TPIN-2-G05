"use client"

import Image from "next/image";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Nav from "@/Components/Nav";
import styles from "@/app/page.module.css";
import { fetchPostUsuario } from "@/api/fetch";

export default function Home() {

  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [usuarioLogueado, setUsuarioLogueado] = useState(-1);
  const router = useRouter()

  function ingresoEmail(event) {
    setEmail(event.target.value)
  }
  function ingresoNombre(event) {
    setNombre(event.target.value)
  }

  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  function ingresoLogued(idUsuario) {
    setUsuarioLogueado(idUsuario)
  }
  
  async function checkRegister() {
    console.log(email, contraseña, nombre, image)
    let respond = await fetchPostUsuario(email, contraseña, nombre, image)
    console.log(respond)
    if (respond == -1) {
      alert("Usuario existente, reingrese")
    } else {
      console.log(respond.res[0].id_usuario)

      localStorage.setItem("chatAPPId_user", respond.res[0].id_usuario)
      alert("Ingresando...")
      router.replace('../Chat', { scroll: false })
    }
  }

  function directionLogin() {
    router.push('/', { scroll: true })
  }

  return (
    <>
      <Nav></Nav>
      <div className={styles.container}>
      <div className={styles.card}>

        <h1 className={styles.title} >ChatApp</h1>
        <h2 className={styles.subtitle}>Registro</h2>
        <h3 className={styles.subtitle2}>Ingrese un email, nombre y contraseña</h3>
        <div className={styles.container}>
          <Input placeholder="Ingrese su nuevo mail" id="email" onChange={ingresoEmail} className={styles.input}></Input>
          <Input placeholder="Ingrese su nombre" id="nombre" onChange={ingresoNombre} className={styles.input}></Input>
          <Input placeholder="Ingrese su nueva contraseña" id="contraseña" onChange={ingresoContraseña} className={styles.input} type = "password"></Input>
          <Button type="button" onClick={checkRegister} text={"Registrarse"} className={styles.button}> </Button>
      </div>
      </div>
      </div>
    </>
  );
}