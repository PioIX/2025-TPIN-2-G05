"use client";

import Button from '@/Components/Button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ImagenClick from '@/Components/ImagenClick'
import { infoUsuario, traerFotoUsuario, traerAmigos } from '@/API/fetch'
import styles from './home.module.css'
import Person from '@/Components/Person'

export default function Home() {
    const [nombreUsuario, setNombreUsuario] = useState("")
    const [idUser, setIdUser] = useState(0)
    const [image, setImage] = useState("")
    const router = useRouter()
    const [amigos, setAmigos] = useState([])

    useEffect(() => {
        let id = localStorage.getItem("idUser")
        console.log("holaa ", id)
        console.log("ID del usuario:", id)
        setIdUser(id)
        fetchFotoUsuario(id)
        fetchDatosUsuario(id)
        async function dataFetch(id) {
            let datos = await traerAmigos(id)
            console.log("amigoss", datos)
            setAmigos(datos)
            console.log("Datos de amigos recibidos:", datos)
            setAmigos(datos.result)
            console.log("Estado de amigos después de setear:", amigos)
        }
        dataFetch(id)
    }, [])

    async function fetchFotoUsuario(id) {
        let respond = await traerFotoUsuario(id)
        console.log("Respuesta foto usuario:", respond)

        if (!respond || !respond.result) {
            console.log("No hay datos de foto")
            return
        }

        try {
            const bytes = respond.result.foto.data || respond.result.foto[0].foto.data
            const base64 = Buffer.from(bytes).toString("base64")
            const dataUrl = `data:image/png;base64,${base64}`
            setImage(dataUrl)
        } catch (error) {
            console.error("Error procesando la foto:", error)
            setImage("")
        }
    }

    async function fetchDatosUsuario(id) {
        let respond = await infoUsuario(id)
        console.log("chauu", respond)
        setNombreUsuario(respond[0].nombre)


    }

    function logOut() { router.replace("../") }

    return (
        <div className={styles.container}>
            <div className={styles.menuLateral}>
                <div className={styles.userSection}>
                    {image && image !== "data:image/png;base64," ? (
                        <img
                            src={image}
                            className={styles.userImage}
                            alt="Usuario"
                        />
                    ) : (
                        <img
                            src="/sesion.png"
                            className={styles.userImage}
                            alt="Usuario"
                        />
                    )}
                    <h3 className={styles.userName}>{nombreUsuario}</h3>
                    <button className={styles.logoutButton} onClick={logOut}>
                        CERRAR SESIÓN
                    </button>
                </div>

                <h3>Amigos</h3>
                <div className={styles.menuAmigos}>
                    {amigos && amigos.length > 0 ? (
                        amigos.map((amigo) => {
                            console.log("Datos de amigo:", amigo)
                            return (
                                <Person
                                    key={amigo.id_usuario}
                                    nombre={amigo.nombre}
                                    foto={amigo.foto}
                                />
                            )
                        })
                    ) : (
                        <p>No hay amigos para mostrar</p>
                    )}
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
