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
  const [jugadoresId, setJugadoresId] = useState(0)
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

  useEffect(() => {
    if (!jugadoresId || jugadoresId.length === 0) return;

    async function cargarJugadores() {
      const respuestas = await Promise.all(  //Se debe usar promise.all porque cada fetchTraerDatosUsuario() hace una llamada asíncrona a infoUsuario(id), pero no espera a que se resuelva antes de pasar al siguiente con un for, en cambio Promise.all si.
        jugadoresId.map(id => infoUsuario(id)) //Aquí espera a que se resuelva para cargar el siguiente y, por cada id de usuario, ejecuta la funcion infoUsuario. 
      );

      // Aquí utiliza la variable creada en cargarJugadores con los objetos ya creados. Cada respuesta es un array con un jugador en [0]
      const jugadoresOrdenados = respuestas.map(respuesta => respuesta[0]);
      //Por último, se carga el array en jugadoresOrdenados, no se utilizó el metodo de prevArray porque provocaba rerenders
      setJugadores(jugadoresOrdenados);
    }

    cargarJugadores();
  }, [jugadoresId]);

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

  useEffect(() => {
    if (!socket) return
    socket.emit('joinRoom', { room: room, user: id })
  }, [id, socket, room])

  useEffect(() => {
    if (!socket) return
    socket.on('joined_OK_room', data => {
      setJugadoresId(data.user)
    })


    if (!socket) return
    socket.on("newMessage", data => {
      console.log(data)
    })

    if (!socket) return
    socket.on("leftRoom", data => {
      openModal("Has abandonado la partida", router.push(`/Home`))
    }), [socket]
  })

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
    socket.emit("sendMessage", { room: room, message: "Hola a todos" })
  }

  function abandonarPartida() {
    socket.emit("leaveRoom")
    router.push(`/Home`)
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
    const src = jugador.foto
      ? `data:image/png;base64,${Buffer.from(jugador.foto.data).toString("base64")}`
      : "/sesion.png";
    console.log(index)
    return <Person key={jugador.id ?? index} text={jugador.nombre} src={src} index={index==0?true:false} />;
  })
}
    {
      idAdmin == id ? (
        <>
          <Button onClick={partidaInit} text={"Inicie partida"} />
          <Button onClick={abandonarPartida} text={"Abandonar partida"} /* Este boton es para dejar la partida, pero esta puesto aca porque como no se pueden crear partidas todos son usuarios admin */></Button>
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