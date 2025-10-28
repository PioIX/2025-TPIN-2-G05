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
      console.log(jugadoresOrdenados)
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
    if (id == localStorage.getItem('idAdmin') > 0) {
      setIdAdmin(id)
    }
  }, [id])

  useEffect(() => {
    if (!socket) return
    socket.emit('joinRoom', { room: room, user: id },
      console.log("me uno a la sala")
    )
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
      const action = router.push(`/Home`)
      openModal("Has abandonado la partida", action)
    }), [socket]
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

  // },[socket])

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
      const src = jugador.foto
        ? `data:image/png;base64,${Buffer.from(jugador.foto.data).toString("base64")}`
        : "/sesion.png";
      console.log(index)
      return <Person key={jugador.id ?? index} text={jugador.nombre} src={src} index={index==0?true:false} />;
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
      action={modalAction || null} // Si modalAction está vacío, pasa null
    />
  </>;
}