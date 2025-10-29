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
import styles from "@/app/page.module.css"
import stylesSE from "@/app/SalaEspera/page.module.css"
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
  const [jugadoresId, setJugadoresId] = useState([]);
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
    console.log(jugadoresId)
    if (!jugadoresId || jugadoresId.length === 0) return;
    async function cargarJugadores() {
      let respuestas = []
      for (let i = 0; i < jugadoresId.length; i++) {
        respuestas.push(await infoUsuario(jugadoresId[i])) ;
        console.log("respuesta jugador", respuestas[i])
      }
      // Aquí utiliza la variable creada en cargarJugadores con los objetos ya creados. Cada respuesta es un array con un jugador en [0])
      //Por último, se carga el array en jugadoresOrdenados, no se utilizó el metodo de prevArray porque provocaba rerenders
      setJugadores(respuestas)
    }

    cargarJugadores();
  }, [jugadoresId]);

  useEffect(() => {
    setId(localStorage.getItem('idUser'))
    setRoom(localStorage.getItem("room"))
  }, [])
  //cada vez que te llega el evento de nuevo jugador en sala

  useEffect(() => {
    if (id == localStorage.getItem('idAdmin') > 0) {
      setIdAdmin(id)
    }
  }, [id])

  useEffect(() => {
    if (!socket) return
    socket.emit('joinRoom', { room: room, user: id },
      console.log("me uno a la sala")
    )
  }, [id, room])

  useEffect(() => {
    if (!socket) return
    socket.on('mensaje', data => {
      console.log(room, data)
      console.log("data.user", data.user)
      socket.emit("sendMessage", { room: room, message: `hola ${data.user}`  })
      setJugadoresId(prevArray => {
        // Evita duplicados
        if (prevArray.includes(data.user)) return prevArray;
        return [...prevArray, data.user];
      });
    })

    if (!socket) return
    socket.on("newMessage", data => {
      console.log(data.message)
    })

    if (!socket) return
    socket.on("leftRoom", data => {
      const action = router.push(`/Home`)
      openModal("Has abandonado la partida", action)
    })

  //   useEffect(()=>{
  //  if (!socket) return;
  //  socket.on("partidaInit", data =>{
  // localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
  //     localStorage.setItem(`letrasProhibidasDeJuego${room}`, letrasProhibidas)
  //     localStorage.setItem(`idAdmin`, idAdmin)
  //     localStorage.setItem(`idUser`, id)
  //     localStorage.setItem(`room`, room)
  //     localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
  //     router.replace('../Game', { scroll: false })
  //  })
  },[socket])

  //inicio de partida
  function partidaInit() {
    socket.emit("sendMessage", { room: room, message: "Hola a todos" })
  }

  function abandonarPartida() {
    salirSala()
    socket.emit("leaveRoom")
  }
  function salirSala() {
    localStorage.setItem(`idAdmin`, -1)
    localStorage.setItem(`room`, -1)
    //salir de la sala
  }
  return <>
  <div className={stylesSE.jugadorescontainer}>
  {
    jugadores.map((jugador, index) => {
      const src = jugador[0].foto
        ? `data:image/png;base64,${Buffer.from(jugador[0].foto.data).toString("base64")}`
        : "/sesion.png";
      return <Person key={jugador[0].id ?? index} text={jugador[0].nombre} src={src} index={index==0?true:false} />;
    })
  }
  </div>
  <div className={stylesSE.container}>
      {
        idAdmin == id && (
          <>
            <Button onClick={partidaInit} text={"Inicie partida"} className={"buttonAbandonar"} />
          </>
        )
      }
      {/* Boton salirse de la sala */}
      <Button onClick={abandonarPartida} text={"Abandonar partida"} className={"buttonAbandonar"} />
  </div>
    {/* Modal Component */}
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      mensaje={modalMessage}
      action={modalAction || null}
      mensajePartidas={""} // Si modalAction está vacío, pasa null
    />
  </>;
}