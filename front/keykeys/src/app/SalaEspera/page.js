"use client";

import clsx from "clsx";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Button from "@/Components/Button";
import { useSocket } from "@/hooks/useSocket"
import { infoUsuarioPartida, actualizarValoresPartidaFalse } from "@/API/fetch";
import Modal from "@/Components/Modal";
import styles from "@/app/page.module.css"
import stylesSE from "@/app/SalaEspera/page.module.css"
import Person from "@/Components/Person";

export default function Game() {
  const [jugadores, setJugadores] = useState([]);
  const [id, setId] = useState(-1);
  const [idAdmin, setIdAdmin] = useState(-1);
  const [room, setRoom] = useState(0)
  const [letrasProhibidas, setLetrasprohibidas] = useState(1);
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [jugadoresId, setJugadoresId] = useState([]);
  const { socket } = useSocket()
  const refJugadores = useRef(jugadores)
  const [cantidadRondas, setCantidadRondas] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal(mensaje, action) {
    setModalMessage(mensaje);
    setModalAction(action)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCantidadRondasChange = (event) => {
    if (event.target.value < 1) {
      event.preventDefault()
    } else {
      setCantidadRondas(event.target.value);
    }
  };

  const handleLetrasProhibidasChange = (event) => {
    if (event.target.value < 1) {
      event.preventDefault()
    } else {
      setLetrasprohibidas(event.target.value)
    }
  };
  useEffect(() => {
    if (!jugadoresId || jugadoresId.length === 0) return;

    async function cargarJugadores() {
      const respuestas = [];
      for (let i = 0; i < jugadoresId.length; i++) {
        respuestas.push(await infoUsuarioPartida(jugadoresId[i]));
        respuestas[i].puntos = 0;
      }
      setJugadores(respuestas);
    }
    cargarJugadores();
  }, [jugadoresId]);

  useEffect(() => {
    setId(localStorage.getItem('idUser'))
    setRoom(localStorage.getItem("room"))
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("Usuarios");
      if (stored) {
        setJugadores(JSON.parse(stored));
        localStorage.removeItem("Usuarios");
      }
    }
  }, [])

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
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [jugadores]);


  useEffect(() => {
    refJugadores.current = jugadores;
  }, [jugadores])

  useEffect(() => {
    if (!socket) return
    if (jugadores.length <= 1)
      socket.on('joined_OK_room', data => {
        console.log("Se ejecuto joinRoom. Datos recibidos en joined_OK_room: ", data)
        setJugadoresId(prevArray => {
          if (prevArray.includes(data.user)) return prevArray;
          const nuevo = [...prevArray, data.user];
          if (Number(localStorage.getItem("idAdmin")) > 0) {
            socket.emit("enviarIdsDeJugadores", { data: nuevo });
          }
          return nuevo;
        });
      });

    if (!socket) return
    socket.on("leftRoomPlayer", data => {
      console.log("Se ejecuto leftRoomPlayer ", data.user.id)

      setJugadores(prevJugadores => {
        const nuevos = prevJugadores.filter(j => {
          const jugador = j[0] || j;
          if (jugador.id_usuario != data.user.id) {
            return jugador.id_usuario
          }
        });

        return nuevos;
      });
      if (id == data.user.id) {
        salirSala()
        const action = router.replace(`/Home`)
        openModal("Has abandonado la partida", action)
      }
    })

    if (!socket) return
    socket.on("leftRoomAdmin", data => {
      const action = router.replace(`/Home`)
      openModal("Has abandonado la partida", action)
    })

    if (!socket && Number(localStorage.getItem("idAdmin")) < 0) {
      return
    } else {
      socket.on("recibirIdsDeJugadores", data => {
        setJugadoresId(data.data.data)
      }
      )
    }
  }, [socket])


  useEffect(() => {
    if (!socket) return;
    socket.on("partidaInitReceive", data => {
      console.log("Recibido del servidor:", data.cantidadRondas, data.letrasProhibidas, data.idAdmin,"Recibido de persona:", id,room,refJugadores.current);
      localStorage.setItem(`rondasTotalesDeJuego${room}`, data.cantidadRondas)
      localStorage.setItem(`letrasProhibidasDeJuego${room}`, data.letrasProhibidas)
      localStorage.setItem(`idAdmin`, data.idAdmin)
      localStorage.setItem(`idUser`, id)
      localStorage.setItem(`room`, room)
      localStorage.setItem("Usuarios", JSON.stringify(refJugadores.current))
      router.replace('../Game', { scroll: false })
    })
  }, [socket])



  useEffect(() => {
    if (jugadores.length != jugadoresId.length) {
      let aux = []
      for (let i = 0; i < jugadores.length; i++) {
        const element = jugadores[i];
        aux.push(element.id_usuario)
      }
      setJugadoresId(aux)
    }
  }, [jugadores])

  useEffect(() => {
    console.log("Estos son los jugadores Id", jugadoresId)
  }, [jugadoresId])

  //inicio de partida
  async function partidaInit() {
    await actualizarValoresPartidaFalse(room)
    socket.emit("partidaInitSend", { cantidadRondas: cantidadRondas, letrasProhibidas: letrasProhibidas, idAdmin: idAdmin })
  }

  function abandonarPartida() {
    if (idAdmin > 0) {
      socket.emit("leaveRoomAdmin")
      salirSala()
    } else {
      socket.emit("leaveRoomPlayer", { id })
      setJugadores([])
      salirSala()
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
          const src = jugador.foto
            ? `data:image/png;base64,${Buffer.from(jugador.foto.data).toString("base64")}`
            : "/sesion.png";
          return <Person key={jugador.id ?? index} text={jugador.nombre} src={src} index={index == 0 ? true : false} />;
        })
      }
    </div>
    <div className={stylesSE.container}>
      {
        idAdmin == id && (
          <>

            <div className={styles.center2}>
              <h2>Configuración de la partida</h2>

              {/* Desplegable de cantidad de rondas */}
              <Input placeholder="Cantidad de Rondas..." onChange={handleCantidadRondasChange} classNameInput={"input"} classNameInputWrapper={"inputWrapperSE"} type="number" > </Input>

              {/* Desplegable de letras prohibidas */}
              <Input placeholder="Cantidad de Letras prohibidas..." onChange={handleLetrasProhibidasChange} classNameInput={"input"} classNameInputWrapper={"inputWrapperSE"} type="number" > </Input>

              {/* Mostrar valores seleccionados */}
              <p>Rondas seleccionadas: {cantidadRondas}</p>
              <p>Letras prohibidas: {letrasProhibidas}</p>
              <Button onClick={partidaInit} text={"Inicie partida"} className={"buttonAbandonar"} />
            </div>
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