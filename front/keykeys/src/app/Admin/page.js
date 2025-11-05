"use client";

import styles from './home.module.css'
import Input from "@/Components/Input";
import { useState } from "react"
export default function Home() {
    const [username, setUsername] = useState("")

    function handleUsername(){
        console.log("a")
    }

  return (
    <div>
      <div>
        <h1>KEY KEYS</h1>
        <div className={styles.menuAdmin}>
            <Input onChange={handleUsername} value={username} placeHolder={"Ingrese Nombre de Usuario"}></Input>
            {eliminar && <button className={`${styles.mainButton} ${styles.game}`}></button>}
            {modificar && <button className={`${styles.mainButton} ${styles.game}`}></button>}

        </div>
      </div>
    </div>
  )
}