"use client"

import Modal from "@/Components/Modal";
import Input from "@/Components/Input";
import Link from "next/link"
import ImagenClick from '@/Components/ImagenClick';
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/page.module.css";
import stylesR from "@/app/Registro/page.module.css"
import { registrarUsuario } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE

export default function Home() {

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null)
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const router = useRouter()
  const fileInputRef = useRef()
  const [modalMessage, setModalMessage] = useState("");  
  const [modalAction, setModalAction] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal(mensaje,action){
    setModalMessage(mensaje);  
    setModalAction(action)
    setIsModalOpen(true);     
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

    function volver(){
    router.replace("/")
  }
  
  async function checkRegister() {
    if (contraseña == "" || nombre == "") {
      openModal("faltan rellenar campos")
    }
    const formData = new FormData(); //Se enviaran los datos en formData porque admite imagenes (o sea, binarios)
    formData.set("nombre", nombre) 
    formData.set("contrasena", contraseña)
    formData.set("foto", image)

    console.log(formData.get("nombre"))
    console.log(formData.get("contrasena"))

    let respond = await registrarUsuario(formData)
    if (respond.result.id == "-1") {
      openModal("Usuario existente, reingrese")
    } else {
      localStorage.setItem("idUser", respond.result.respuesta[0].id_usuario)
      router.replace('../Home', { scroll: false });

    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
        <ImagenClick src = {"/volver.png"} onClick={volver} className={"imagenClick"}></ImagenClick>
          <h1 className={styles.title} >Keykeys</h1>
          <h2 className={styles.subtitle2}>Registro</h2>
          <h3 className={styles.subtitle}>Ingrese un nombre, una contraseña y una foto</h3>
          <div className={styles.container}>
            <div className={stylesR.containerInputsYBoton}>
              <div className={stylesR.conatinerInputs}>
                <Input placeholder="Ingrese su nombre..." value={nombre} onChange={ingresoNombre} classNameInput={"input"} classNameInputWrapper={"inputWrapper"} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkRegister() } }}></Input>
                <Input placeholder="Ingrese su nueva contraseña..." value={contraseña} onChange={ingresoContraseña} classNameInput={"input"} classNameInputWrapper={"inputWrapper"} type="password" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkRegister() } }}></Input>
                <Button type="button" onClick={checkRegister} text={"Registrarse"} className={"button"} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); checkRegister() } }}> </Button>
              </div>
              <div className={stylesR.uploadContainer}>
                {image ? <><img src={preview} alt="Cargando..." width={450} height={700} onClick={removeImageAndPreview}></img></> :
                  <>
                    <label htmlFor="file-input" className={stylesR.uploadButton}>...</label>
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      className={stylesR.fileInput}
                      onChange={handleChangeImage}></input>
                  </>
                }

              </div>
            </div>
            <h4 className={styles.subtitle3}>¿Ya tiene cuenta? Iniciar sesión</h4>
            <Link href="/Login" className={styles.irALaOtraPagina}>Inicio de sesión</Link>
          </div>
        </div>
      </div>
      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        mensaje={modalMessage}
        action={modalAction || null} // Si modalAction está vacío, pasa null
      />     
    </>
  );
}