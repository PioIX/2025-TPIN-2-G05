"use client";

import styles from './home.module.css'
import Input from "@/Components/Input";
import { useState } from "react"
import Button from "@/Components/Button";
import { deleteUser } from "@/API/fetch";

export default function Home() {
    const [username, setUsername] = useState("")
    const [menu, setMenu] = useState("username") //Booleano para cambiar entre eliminar o modificar
    const [check, setCheck] = useState(false)

    function handleUsername(event){
        setUsername(event.target.value)
    }

    function checkear(){
      if(username){return true}
    }

    function menuEliminar(){
      setCheck(checkear())
      setMenu("eliminar")
    }

    function menuModificar(){
      setCheck(checkear())
      setMenu("modificar")
    }

    function modificarUsuario(){
      //HACER EL FETCH DE ESTA THING
      alert("Usuario Modificado")
    }

    async function eliminarUsuario(){
      deleteUser(username)
      alert("Usuario Eliminado")

    }

    function volver(){
      router.push("../")
    }
  return (

    <div>
      <h1>MENU ADMINISTRADOR</h1>
      <div>
          <Input onChange={handleUsername} value={username} placeHolder={"Ingrese Nombre de Usuario"}></Input>
          <Button onClick={menuModificar} text={"Modificar"} className={`${styles.mainButton} ${styles.game}`}></Button>
          <Button onClick={menuEliminar} text={"Eliminar"} className={`${styles.mainButton} ${styles.game}`}></Button> 
          {(menu=="modificar" && check) &&
            <div>
              <Button onClick={modificarUsuario} text={"Modificar el Nombre de Usuario"} className={`${styles.mainButton} ${styles.game}`}></Button>
              <Input onChange={handleUsername} value={username} placeHolder={"Ingrese el Nuevo Nombre de Usuario"}></Input>

            </div>
          }



          {(menu=="eliminar" && check) &&
            <div>
              <Button onClick={eliminarUsuario} text={"Eliminar Usuario"}></Button>
            </div>
          }
          <Button onClick={volver} text={"Volver"} className={`${styles.mainButton} ${styles.game}`}></Button>
      </div>
    </div>
  )
}