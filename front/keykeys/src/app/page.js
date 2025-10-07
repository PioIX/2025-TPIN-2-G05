"use client"

import styles from "./page.module.css";
import Nav from "@/Components/Nav";
import clsx from "clsx";
import Input from "@/Components/Input";
import { fetchUserLog } from "@/api/fetch";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()

  function ingresoEmail(event) {
    setEmail(event.target.value)
  }
  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  async function checkLogin() {
    if (contraseña == "" || email == "") {
      alert("faltan rellenar campos")
    } else {
      let respond = await fetchUserLog(email, contraseña)
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
          router.replace('/Chat', { scroll: false })
          break
      }
    }

  }

  return (
    <>
      <Nav></Nav>
      <div className={styles.container}>
      <div className={styles.card}>
      <h1 className={clsx(styles.title)}>ChatApp</h1>
      <h2 className={clsx(
        {[styles.subtitle]: true,}
        )
        }>Inicie sesión</h2 >
      <h3 className= {clsx({
        [styles.subtitle2]: true,
      })}>Ingrese su email y contraseña</h3>
      <div className={clsx(styles.container)}>
      <Input placeholder="Ingrese su mail" id="email" onChange={ingresoEmail} className={clsx({
        [styles.input]: true,
      })}> </Input>
      <Input placeholder="Ingrese su contraseña" id="contraseña" onChange={ingresoContraseña} className={clsx(styles.input)} type = "password"
      > </Input>
      <Button type="button" onClick={checkLogin} text={"Iniciar sesion"} className={styles.button}> </Button>
      </div>
      </div>
      </div>
  </>
  );
}