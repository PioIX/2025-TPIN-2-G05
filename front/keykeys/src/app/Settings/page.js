"use client";
import Modal from "@/Components/Modal";
import ImagenClick from "@/Components/ImagenClick";
import styles from "@/app/page.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
import { actualizarDatosUsuario } from "@/API/fetch";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Settings() {
  const [id, setIdUser] = useState(0);
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("idUser");
    setIdUser(id);
  }, []);

  function openModal(mensaje, action) {
    setModalMessage(mensaje);
    setModalAction(action);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };
  function cambiarNombre(event) {
    setNombre(event.target.value);
    console.log(nombre);
  }
  function cambiarContraseña(event) {
    setContraseña(event.target.value);
  }

  function cambiarFoto(event) {
    setImage(event.target.value);
  }

  async function enviarDatos() {
    const formData = new FormData()
    formData.set("nombre", nombre)
    formData.set("contrasena", contraseña)
    formData.set("foto", image)
    formData.set("id_usuario", id)

    let respond = await actualizarDatosUsuario(formData);
    if (respond.result.res == 1) {
      openModal("Datos actualizados correctamente", "volver");
    } else {
      openModal("Error al actualizar los datos, intente nuevamente");
    }
  }

  function removeImageAndPreview() {
    setImage("");
    setPreview(null);
  }

  function handleChangeImage(event) {
    let file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Configuracion</h1>
        <div>
          <Input
            placeholder="Modificar nombre"
            id="nombre"
            onChange={cambiarNombre}
            classNameInput={"input"}
            classNameInputWrapper={"inputWrapperLog"}
          >
            {" "}
          </Input>
          <Input
            placeholder="Modificar contraseña..."
            id="contraseña"
            onChange={cambiarContraseña}
            classNameInput={"input"}
            classNameInputWrapper={"inputWrapperLog"}
            type="password"
          >
            {" "}
          </Input>
          {image ? (
            <>
              <img
                src={preview}
                alt="Cargando..."
                width={450}
                height={700}
                onClick={removeImageAndPreview}
              ></img>
            </>
          ) : (
            <>
              <label htmlFor="file-input" className={styles.uploadButton}>
                ...
              </label>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleChangeImage}
              ></input>
            </>
          )}
        </div>

        <Button type="button" onClick={enviarDatos} text={"cambiar datos"}>
          {" "}
        </Button>
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
