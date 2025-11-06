"use client";


import clsx from "clsx";
import styles from "../page.module.css";
import stylesG from "./game.module.css";
import { checkearPalabra } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import UserPoint from "@/Components/UserPoint"
import ImagenClick from "@/Components/ImagenClick"
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Button from "@/Components/Button";
import Person from "@/Components/Person";
import LetraProhibida from "@/Components/LetraProhibida";
import Modal from "@/Components/Modal";
import { useSocket } from "@/hooks/useSocket";

export default function Game() {
  const [jugadores, setJugadores] = useState([]);
  const [palabra, setPalabra] = useState("");
  const [id, setId] = useState("");
  const [idAdmin, setIdAdmin] = useState("")
  const [prevPalabra, setPrevPalabra] = useState("");
  const [room, setRoom] = useState("");
  const [letrasprohibidas, setLetrasprohibidas] = useState([]);
  const [cantidadLetras, setCantidadLetras] = useState("");
  const [rondas, setRondas] = useState("");
  const [ronda, setRonda] = useState(0);
  const [activo, setActivo] = useState(undefined);
  const router = useRouter();
  const { socket } = useSocket()
  const [contador, setContador] = useState(10)


  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal(mensaje, action) {
    setModalMessage(mensaje);
    setModalAction(action)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function ingresoNombre(event) {
    setNombre(event.target.value)
  }

  //codigo en eladmin y //hacer tema rondas
  useEffect(() => {

    console.log(localStorage)
    console.log(localStorage.getItem("idAdmin"), localStorage.getItem("idUser"), "admin", localStorage.getItem("idAdmin") == localStorage.getItem(`idUser`))
    setActivo(true)
    console.log("rondas", localStorage.getItem(`rondasTotalesDeJuego${localStorage.getItem("room")}`), "letras", localStorage.getItem(`letrasProhibidasDeJuego${localStorage.getItem("room")}`))
    setPrevPalabra("aaa")
    setRoom(localStorage.getItem(`room`))
    const stored = localStorage.getItem("Usuarios");
    setId(localStorage.getItem(`idUser`))
    setJugadores(JSON.parse(stored))
    console.log("Esto es elparse de stored ", JSON.parse(stored))
    if (localStorage.getItem(`idUser`) == localStorage.getItem("idAdmin")) {
      setRondas(localStorage.getItem(`rondasTotalesDeJuego${localStorage.getItem("room")}`))
      setCantidadLetras(localStorage.getItem(`letrasProhibidasDeJuego${localStorage.getItem("room")}`))
      if (ronda == undefined) {
        setRonda(0)
      }
      socket.emit("iniciarDentroDeLaPartida", { })
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.emit("joinRoom", { room: room, id: id },
      console.log("Se hizo el joinRoom")
    )
  }, [id, room])

  // //cada vez que te llega el , evento de cambio de ronda + al inicio
  useEffect(() => {
    if (!socket) return;
    socket.on("cambioRondaReceive", data => {
      //setJugadores(data.jugadores)
      if (id == localStorage.getItem("idAdmin")) {
        if (ronda > rondas) {
          socket.emit("terminarPartida", { data: jugadores })
        } else {
          setRonda(ronda + 1)
          setLetrasprohibidas([])
          setPrevPalabra("")
          const letras = "abcdefghijklmnñopqrstuvwxyz"
          for (let i = 0; i < cantidadLetras; i++) {
            const indiceAleatorio = Math.floor(Math.random() * letras.length);
            setLetrasprohibidas((prev) => [...prev, letras.charAt(indiceAleatorio)]);
          }
          setActivo(true)// hay que hacer que el admin no juegue en la ronda inicial siempre//mensaje en socketTurno
        }
      }
    }
  )}, [socket /**Aca iba socketRonda en vez de socket */])


  useEffect(()=>{
    console.log("Estas son las rondas ", rondas)
  }, [rondas])

  useEffect(()=>{
    console.log(ronda)
  }, [ronda])

  // //terminar partida
  useEffect(() => {
    if (!socket) return;
    socket.on("terminarPartida", data => {
      //setJugadores(data.jugadores)
      const accion = () => { router.replace('../SalaEspera', { scroll: false }) };
      openModal("Partida Finalizada", { accion: accion })
      //Modal de fin de partida + resultados
      //boton de ir a sala de espera
      //El siguiente codigo se ejecuta al iniciar la partida
    })
    if (!socket) return
    socket.on("iniciarDentroDeLaPartida", data => { //Creo que era para hacer un random del array de jugadores que le mandes
      //setJugadores(data.jugadores)
    })


    if (!socket) return
    socket.on("joined_OK_room", data => {
      console.log("El usuario ", data.user, " se unió a la partida ", data.room)
    })
  }, [socket])

  // //useEffect(()=>{
  //  if (!socket) return;
  // socket.on("cambioTurno", data =>{
  //  setJugadores(data.jugadores),
  //  setPrevPalabra(data.palabra),
  //  let index = data.index}
  //)
  //lOS SOCKET MANDAN
  //jugadores (array) contiene: objeto con (puntos; foto; id;nombre) IMPORTANTE!!!! PARA SABER QUIEN VA DESPUES USA EL INDEX EN EL ARRAY DE JUGADORES, COMPROBA EL ID DEL LOCALSTORAGE CON EL ID DE USUARIO QUE TE DEVUELVE SI HACES JUGADORES[INDEX].id_usuario
  //prevPalabra (string)
  //idTurno de quien vaya (se puede poner nombre tambien)
  //ronda por la que se vaya
  //letras que estan prohibidas
  useEffect(() => {
    if (!socket) return
    socket.on("cambioTurnoReceive", (data) => {
      console.log(data)
    })
    //setPrevPalabra(socket.prevpalabra)
    if (id == socket.idTurno) {
      //setRonda(socket.ronda)
      //setPalabra("")
      //setLetrasprohibidas(socket.letras)
      //setActivo(true)
    } else {
      //setActivo(false)
    }
  }, [socket /**Aca iba socketTurno en vez de socket */])



  //Esto va en el onchange del input
  async function envioPalabra() {
    if (prevPalabra.length < palabra.length) {
      let valid = await checkearPalabra(palabra)//fetch de palabras o comprobacion si la palabra existe-es valida
      console.log(valid)
      if (valid) {
        for (let i = 0; i < jugadores.length; i++) {
          if (jugadores[i].id == id) {
            jugadores[i].puntos += palabra.length;
            socket.emit("cambioTurno", { jugadores: jugadores, palabra: palabra, index: i })
            break; // corta el bucle si ya lo encontró
          }
        }
      } else {
        //palabra invalida
      }
    } else {
      // return que palabra es invalida
    }
  }


  //esto va en el on key down
  function checkLetra(event) {
    let letra = event.key
    for (let i = 0; i < letrasprohibidas.length; i++) {
      if (letrasprohibidas[i] == letra.toLowerCase()) {
        event.preventDefault()
      }
    }
  }
  function cambiarPalabra(event) {
    setPalabra(event.target.value)
  }



  //TIMER
  useEffect(() => {
    //Esto usa timers temporales de 1 segundo en vez de uno de 10. Cuando llega a 0 no se crean más timers.
    if (contador > 0) {
      const timer = setInterval(() => {
        setContador(contadorPrevio => contadorPrevio - 1);
      }, 1000);
      return () => {
        clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonta o el contador cambia
      }
    } else {
      console.log(jugadores)
      for (let i = 0; i < jugadores.length; i++) {
        if (jugadores[i].id_usuario == id) {
          jugadores[i].puntos -= 10;
          setJugadores((prevArray) => [...prevArray, {}])
          setJugadores((prevArray) => prevArray.slice(0, -1))
          break; // corta el bucle si ya lo encontró
        }
      }
      socket.emit("cambioRondaSend", { data: jugadores })
    }
  }, [contador]);
  return (
    <>
      <p className={stylesG.contador}>{contador}'</p>

      <div className={stylesG[activo]}>
        <div className={styles.top}>
          <h3>Ronda {ronda}/{rondas}</h3>
        </div>
        <div className={stylesG.contenedorPrincipal}>

          <div className={stylesG.userPointContainer}>

            {jugadores &&
              jugadores.map((jugador, index) => {
                console.log("jugador en el map ", jugador)
                const src = jugador.foto
                  ? `data:image/png;base64,${Buffer.from(jugador.foto.data).toString("base64")}`
                  : "/sesion.png";
                return (
                  <UserPoint
                    key={index}
                    points={jugador.puntos}
                    src={src}
                  ></UserPoint>
                );
              })}
          </div>
          <div className={stylesG.bloqueprohibidas}>
            <h2 className={styles.subtitle2}>Letras Prohibidas...</h2>
            <div className={stylesG.cajaprohibidas}>
              {letrasprohibidas != undefined &&
                letrasprohibidas.map((letrasprohibida, index) => {
                  console.log(letrasprohibida)
                  return (
                    <LetraProhibida
                      key={index}
                      letra={letrasprohibida.toUpperCase()}
                    ></LetraProhibida>
                  );
                })}
            </div>
          </div>

          <div className={stylesG.longitudYinput}>
            <h2 className={styles.subtitle2}>
              Longitud {prevPalabra.length + 1} o más
            </h2>

            <div className={stylesG.inputContainer}>
              {activo == true ? (
                <div className={styles.flex}>
                  <Input
                    onKeyDown={(e) => {
                      checkLetra(e);
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        envioPalabra();
                      }
                    }}
                    onChange={cambiarPalabra}
                    classNameInputWrapper="inputWrapperGame"
                    classNameInput="inputGame"
                    placeholder="Escribir acá"
                  />
                  <div className={stylesG.aumentar}>
                    <ImagenClick onClick={envioPalabra} src={"/next.png"} />
                  </div>
                </div>
              ) : (
                <h2 className={styles.subtitle}>
                  No es tu turno
                </h2>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          mensaje={modalMessage}
          jugadores={jugadores}
          action={modalAction || null}
        />
      </div>
    </>
  );

}
