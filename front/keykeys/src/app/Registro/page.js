"use client"

import Input from "@/Components/Input";
import Link from "next/link"
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { registrarUsuario } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE

export default function Home() {

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null)
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()
  const fileInputRef = useRef()

  function ingresoNombre(event) {
    setNombre(event.target.value)
  }

  function ingresoContraseña(event) {
    setContraseña(event.target.value)
  }

  function handleChangeImage(event) {
    let file = event.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  useEffect(() => {
    console.log(image)
  }, [image])

  useEffect(() => {
    console.log(preview)
  }, [preview])

  function removeImageAndPreview() {
    setImage("")
    setPreview(null)
  }

  async function checkRegister() {
    const formData = new FormData(); //Se enviaran los datos en formData porque admite imagenes (o sea, binarios)
    formData.set("nombre", nombre) 
    formData.set("contrasena", contraseña)
    formData.set("foto", image)

    console.log(formData.get("nombre"))
    console.log(formData.get("contrasena"))

    let respond = await registrarUsuario(formData)//REEMPLAZAR CON EL FETCH CORRESPONDIENTE
    console.log(respond.result.id)
    if (respond.result.id == "-1") {
      alert("Usuario existente, reingrese")
    } else {
      localStorage.setItem("chatAPPId_user", respond.result.id)
      alert("Ingresando...")
      router.replace('../Home', { scroll: false })
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title} >Keykeys</h1>
          <h2 className={styles.subtitle}>Registro</h2>
          <h3 className={styles.subtitle2}>Ingrese un nombre, una contraseña y una foto</h3>
          <div className={styles.container}>
            <div className={styles.containerInputsYBoton}>
              <div className={styles.conatinerInputs}>
                <Input placeholder="Ingrese su nombre..." id="nombre" onChange={ingresoNombre} classNameInput={styles.input} classNameInputWrapper={styles.inputWrapper}></Input>
                <Input placeholder="Ingrese su nueva contraseña..." id="contraseña" onChange={ingresoContraseña} classNameInput={styles.input} classNameInputWrapper={styles.inputWrapper} type="password"></Input>
                <Button type="button" onClick={checkRegister} text={"Registrarse"} className={styles.button}> </Button>
              </div>
              <div className={styles.uploadContainer}>
                {image ? <><img src={preview} alt="Cargando..." width={450} height={700} onClick={removeImageAndPreview}></img></> :
                  <>
                    <label htmlFor="file-input" className={styles.uploadButton}>...</label>
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={handleChangeImage}></input>
                  </>
                }

              </div>
            </div>
            <h4 className={styles.subtitle3}>¿Ya tiene cuenta? Iniciar sesión</h4>
            <Link href="/" className={styles.irALaOtraPagina}>Inicio de sesión</Link>
          </div>
        </div>
      </div>
    </>
  );
}