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
  const [id, setId] = useState(-1);
  const [idAdmin, setIdAdmin] = useState(-1);
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
    if (!jugadoresId || jugadoresId.length === 0) return;

    async function cargarJugadores() {
      const respuestas = [];
      for (let i = 0; i < jugadoresId.length; i++) {
        respuestas.push(await infoUsuario(jugadoresId[i]));
        console.log("respuesta jugador", respuestas[i]);
      }
      console.log(respuestas)
      setJugadores(respuestas);
    }
    cargarJugadores();
  }, [jugadoresId]);

  useEffect(() => {
    setId(localStorage.getItem('idUser'))
    setRoom(localStorage.getItem("room"))
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("Usuarios");
      console.log("Esto es stored ", stored)
      if (stored) {
        setJugadores(JSON.parse(stored));
        localStorage.removeItem("Usuarios");
        console.log("Se cargaron los jugadores desde localStorage");
      }
    }
  }, [])

  useEffect(()=>{
    console.log("Estos son los jugadores ", jugadores)
  },[jugadores])
  //cada vez que te llega el evento de nuevo jugador en sala

  useEffect(() => {
    if (id == localStorage.getItem('idAdmin')) {
      setIdAdmin(id)
    }
  }, [id])

  useEffect(() => {
    if (!socket) return
    socket.emit('joinRoom', { room: room, user: id },
      console.log("me uno a la sala"),
    )
  }, [id, room])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("Usuarios", JSON.stringify(jugadores));
      console.log("Se guardaron los jugadores antes de recargar");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [jugadores]);


  useEffect(() => {
    if (!socket) return
    if (jugadores.length == 0)
    socket.on('joined_OK_room', data => {
      setJugadoresId(prevArray => {
        if (prevArray.includes(data.user)) return prevArray;
        const nuevo = [...prevArray, data.user];
        if (Number(localStorage.getItem("idAdmin")) > 0) {
          socket.emit("enviarIdsDeJugadores", { data: nuevo });
        }
        console.log(nuevo)
        return nuevo;
      });
    });

    if (!socket) return
    socket.on("leftRoomPlayer", data => {
      if (id == localStorage.getItem("id")){
        salirSala()
        console.log("Se ejecuto leftRoomPlayer ", data)
      }

    })

    if (!socket) return
    socket.on("leftRoomAdmin", data => {
      const action = router.push(`/Home`)
      openModal("Has abandonado la partida", action)
    })

    if (!socket && Number(localStorage.getItem("idAdmin")) < 0) {
      return
    } else {
      socket.on("recibirIdsDeJugadores", data => {
        console.log("Toma que el idAdmin es menor a 0")
        console.log(Number(localStorage.getItem("idAdmin")) < 0)
        console.log(jugadoresId)
        console.log(!jugadoresId || jugadoresId.length === 0)
        console.log("Estos son los ids", data)
        setJugadoresId(data.data.data)
      }
      )
    }

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
  }, [socket])

  //inicio de partida
  function partidaInit() {
    socket.emit("sendMessage", { room: room, message: "Hola a todos" })
  }

  function abandonarPartida() {
    if (idAdmin > 0){
      socket.emit("leaveRoomAdmin")
    }else{
      socket.emit("leaveRoomPlayer", { id })
    }
  }
  function salirSala() {
    localStorage.removeItem("Usuarios")
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
          return <Person key={jugador[0].id ?? index} text={jugador[0].nombre} src={src} index={index == 0 ? true : false} />;
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