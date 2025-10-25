"use client";

import clsx from "clsx";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/Components/Button";
import { useSocket } from "@/hooks/useSocket"
import { infoUsuario } from "@/API/fetch";
import Modal from "@/Components/Modal";
import styles from "./page.module.css"
import Person from "@/Components/Person";

export default function Game() {
  const [jugadores, setJugadores] = useState([]);
  const [id, setId] = useState("");
  const [idAdmin, setIdAdmin] = useState("");
  const [room, setRoom] = useState(0)
  const [rondas, setRondas] = useState("");
  const [letrasProhibidas, setLetrasprohibidas] = useState("");
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState("");
  const { socket } = useSocket()

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal(mensaje, action) {
    setModalMessage(mensaje);
    setModalAction(action)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function fetchTraerDatosUsuario(id) {
    let respond = await infoUsuario(id)
    console.log(respond)
    return respond
  }
  
  useEffect(() => {
    setId(localStorage.getItem('idUser'))
    setRoom(localStorage.getItem("room"))
  }, [])
  //cada vez que te llega el evento de nuevo jugador en sala


  useEffect(() => {
    if (id == localStorage.getItem('idAdmin')) {
      setIdAdmin(id)
    }
    console.log(room)
    console.log(id)
    if (!socket) return
    socket.emit('joinRoom', {room: room, user: id})
  }, [id])

  useEffect(() => {
    if (!socket) return
    socket.on('joined_OK_room', data => {
      let usuario = fetchTraerDatosUsuario(data.user)
      setJugadores(prevArray => [...prevArray, usuario])
    })
  }, [socket])

  //   useEffect(()=>{
  //     localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
  //     localStorage.setItem(`letrasProhibidasDeJuego${room}`, letrasProhibidas)
  //     localStorage.setItem(`idAdmin`, idAdmin)
  //     localStorage.setItem(`idUser`, id)
  //     localStorage.setItem(`room`, room)
  //     localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
  //     router.replace('../Game', { scroll: false })
  // },[socketPlay])

  //inicio de partida
  function partidaInit() {
    //mandar socket en rondas letrasProhibidas admin idUser room
  }

  function salirSala() {
    localStorage.setItem(`idAdmin`, -1)
    localStorage.setItem(`room`, -1)
    openModal("Saliendo de la sala", router.replace('../Home', { scroll: false }))
    //salir de la sala
  }
  return <>
    {
      jugadores.map((jugador, index) => {
        <Person key={index} text={jugador.nombre} src={jugador.foto ? `data:image/png;base64,${Buffer.from(amigo.foto.data).toString("base64")}` : "/sesion.png"}></Person>
      })
    }
    {
      idAdmin == id ? (
        <Button onClick={partidaInit} text={"Inicie partida"} />
      ) : (
        <h2 className={styles.subtitle}>No es tu turno</h2>
      )
    }
    {/* Boton salirse de la sala */}
    {/* Modal Component */}
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      mensaje={modalMessage}
      action={modalAction || null} // Si modalAction está vacío, pasa null
    />
  </>;
}