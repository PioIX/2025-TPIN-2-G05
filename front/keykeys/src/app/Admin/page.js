"use client";

import styles from './home.module.css'
import Input from "@/Components/Input";
import { useState, useEffect } from "react"
import Button from "@/Components/Button";
import { deleteUser, editUser } from "@/API/fetch";
import { useRouter } from "next/navigation"

export default function Home() {
    const [username, setUsername] = useState("")
    const [menu, setMenu] = useState("admin") //Booleano para cambiar entre eliminar o modificar
    const [check, setCheck] = useState(false)
    const router = useRouter()
    const [newUsername, setNewUsername] = useState("")
    const [oldUsername, setOldUsername] = useState("")
    const [id, setIdUser] = useState(0);


    function handleUsername(event){
        setUsername(event.target.value)
    }

    function handleOldUsername(event){
      setOldUsername(event.target.value)
    }

    function handleNewUsername(event){
      setNewUsername(event.target.value)
    }

    function checkear(){
      if(username){return true}
    }

    function menuEliminar(){
      setMenu("eliminar")
    }

    function menuModificar(){
      setMenu("modificar")
    }

    function modificarUsuario(){
      editUser(newUsername, oldUsername)
      alert("Usuario Modificado")
    }

    async function eliminarUsuario(){
      deleteUser(username)
      alert("Usuario Eliminado")

    }

    function volver(){
      router.push("Home")
    }

    function menuAdmin(){
      setMenu("admin")
    }

      useEffect(() => {
        let id = localStorage.getItem("idUser");
        setIdUser(id);
      }, []);

  return (

    <div>
      <h1>MENU ADMINISTRADOR</h1>
      <div>
          {menu=="admin" &&
            <div>
              <Button onClick={menuModificar} text={"Modificar"} className={`${styles.mainButton} ${styles.game}`}></Button>
              <Button onClick={menuEliminar} text={"Eliminar"} className={`${styles.mainButton} ${styles.game}`}></Button>
              <Button onClick={volver} text={"Volver al Menú Principal"} className={`${styles.mainButton} ${styles.game}`}></Button>

            </div>
          }
          {(menu=="modificar") &&
            <div>
              <Input onChange={handleOldUsername} value={oldUsername} placeholder={"Ingrese Nombre de Usuario"}></Input>
              <Button onClick={modificarUsuario} text={"Modificar el Nombre de Usuario"} className={`${styles.mainButton} ${styles.game}`}></Button>
              <Input onChange={handleNewUsername} value={newUsername} placeholder={"Ingrese el Nuevo Nombre de Usuario"}></Input>
              <Button onClick={menuAdmin} text={"Volver"} className={`${styles.mainButton} ${styles.game}`}></Button>

            </div>
          }
          {(menu=="eliminar") &&
            <div>
              <Input onChange={handleUsername} value={username} placeholder={"Ingrese Nombre de Usuario"}></Input>
              <Button onClick={eliminarUsuario} text={"Eliminar Usuario"}></Button>
              <Button onClick={menuAdmin} text={"Volver"} className={`${styles.mainButton} ${styles.game}`}></Button>

            </div>
          }
      </div>
    </div>
  )
}