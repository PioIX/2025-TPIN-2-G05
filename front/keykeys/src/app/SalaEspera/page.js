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

  //Lo que tenes que hacer es agarrar el array del socket y setear jugadores a eso
  async function fetchTraerDatosUsuario(id) {
    let respond = await infoUsuario(id)
    setJugadores(prevArray => [...prevArray, respond[0]])
  }

  useEffect(()=>{
    console.log(jugadores)
  }, [jugadores])
  
  useEffect(() => {
    setId(localStorage.getItem('idUser'))
    setRoom(localStorage.getItem("room"))
  }, [])
  //cada vez que te llega el evento de nuevo jugador en sala


  useEffect(() => {
    if (id == localStorage.getItem('idAdmin')) {
      setIdAdmin(id)
    }
  }, [id])

  useEffect(()=>{
    if (!socket) return
    socket.emit('joinRoom', {room: room, user: id})
  }, [id, socket, room])

  useEffect(() => {
    if (!socket) return
    socket.on('joined_OK_room', data => {
      console.log(data)
      for (let i = 0; i < data.user.length; i++){
        fetchTraerDatosUsuario(data.user[i])
      }
    })

    if (!socket) return
    socket.on("newMessage", data =>{
      console.log(data)
    })

    if(!socket) return
    socket.on("leftRoom", data =>{
      console.log(data.message)
      openModal("Has abandonado la partida", router.back())
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
    socket.emit("sendMessage", {room: room, message: "Hola a todos"})
  }

  function abandonarPartida(){
    socket.emit("leaveRoom")
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
        return(<Person key={index} text={jugador.nombre} src={jugador.foto ? `data:image/png;base64,${Buffer.from(jugador.foto.data).toString("base64")}` : "/sesion.png"}></Person>)
      })
    }
    {
      idAdmin == id ? (
        <>
        <Button onClick={partidaInit} text={"Inicie partida"} />
        <Button onClick ={abandonarPartida} text = {"Abandonar partida"} /* Este boton es para dejar la partida, pero esta puesto aca porque como no se pueden crear partidas todos son usuarios admin */></Button>
        </>
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