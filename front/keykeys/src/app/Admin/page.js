"use client";

import styles from './home.module.css'
import Input from "@/Components/Input";
import { useState } from "react"
import Button from "@/Components/Button";


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

    function eliminarUsuario(){
      //HACER EL FETCH DE ESTA THING
      alert("Usuario Eliminado")
    }

  return (

    <div>
      <h1>KEY KEYS</h1>
      <div>
          <Input onChange={handleUsername} value={username} placeHolder={"Ingrese Nombre de Usuario"}></Input>
          <Button onClick={menuModificar} text={"Modificar"}></Button>
          <Button onClick={menuEliminar} text={"Eliminar"}></Button> 
          {(menu=="modificar" && check) &&
            <div>
              <Button onClick={modificarUsuario} text={"Modificar el Nombre de Usuario"}></Button>
              <Input onChange={handleUsername} value={username} placeHolder={"Ingrese el Nuevo Nombre de Usuario"}></Input>

            </div>
          }



          {(menu=="eliminar" && check) &&
            <div>
              <Button onClick={eliminarUsuario} text={"Eliminar Usuario"}></Button>
            </div>
          }
      </div>
    </div>
  )
}