"use client"

import Button from '@/Components/Button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ImagenClick from '@/Components/ImagenClick'
import { traerFotoUsuario } from '@/API/fetch'
import styles from './home.module.css'

export default function Home() {
    const [idUser, setIdUser] = useState(0)
    const [image, setImage] = useState("")
    const router = useRouter()

    useEffect(() => {
        let id = localStorage.getItem("idUser")
        setIdUser(id)
        fetchFotoUsuario(id)
    }, [])

    async function fetchFotoUsuario(id) {
        let respond = await traerFotoUsuario(id)
        const bytes = respond.result.foto[0].foto.data
        const base64 = Buffer.from(bytes).toString("base64")
        const dataUrl = `data:image/png;base64,${base64}`
        setImage(dataUrl)
    }

    function logOut() { router.replace("../") }

    return (
        <div className={styles.container}>
            <div className={styles.menuLateral}>
                <div className={styles.userSection}>
                    <img
                        src={image !== "data:image/png;base64," ? image : "/sesion.png"}
                        className={styles.userImage}
                        alt="Usuario"
                    />
                    <h3 className={styles.userName}>Scott</h3>
                    <button className={styles.logoutButton} onClick={logOut}>
                        CERRAR SESIÓN
                    </button>
                </div>

                <h3>Amigos</h3>
                <div className={styles.menuAmigos}>
                    <div className={styles.amigo}><img src="/gunter.png" /> Gunter</div>
                    <div className={styles.amigo}><img src="/messi.png" /> Missi</div>
                    <div className={styles.amigo}><img src="/bob.png" /> Bob</div>
                    <div className={styles.amigo}><img src="/patricio.png" /> Patricio</div>
                </div>

                <button className={styles.agregarButton}>AGREGAR</button>
            </div>

            <div className={styles.menuJuego}>
                <h1>KEY KEYS</h1>
                <button className={`${styles.mainButton} ${styles.join}`}>Unirse a una sala</button>
                <button className={`${styles.mainButton} ${styles.create}`}>Crear una sala</button>
                <button className={`${styles.mainButton} ${styles.config}`}>Configuración</button>
            </div>
        </div>
    )
}
