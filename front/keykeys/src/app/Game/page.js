"use client";


import clsx from "clsx";
import styles from "../page.module.css";
import stylesG from "./game.module.css";
import { checkearPalabra } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import UserPoint from "@/Components/UserPoint"
import ImagenClick from "@/Components/ImagenClick"
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [prevPalabra, setPrevPalabra] = useState("");
  const [room, setRoom] = useState("");
  const [letrasprohibidas, setLetrasprohibidas] = useState([]);
  const [cantidadLetras, setCantidadLetras] = useState("");
  const [rondas, setRondas] = useState("");
  const [ronda, setRonda] = useState(0);
  const [activo, setActivo] = useState(false);
  const router = useRouter();
  const { socket } = useSocket()
  const [contador, setContador] = useState(10)
  const [palabraMasCorta, setPalabraMasCorta] = useState(false)
  const [palabraNoExiste, setPalabraNoExiste] = useState(false)

  const refJugadores = useRef(jugadores)
  const refModal = useRef(false)
  const refRonda = useRef(0)

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

  //codigo en eladmin y //hacer tema rondas
  useEffect(() => {
    setPrevPalabra("aaa")
    setRoom(localStorage.getItem(`room`))
    const stored = localStorage.getItem("Usuarios");
    setId(localStorage.getItem(`idUser`))
    setJugadores(JSON.parse(stored))
    setRondas(localStorage.getItem(`rondasTotalesDeJuego${localStorage.getItem("room")}`))
    if (localStorage.getItem(`idUser`) == localStorage.getItem("idAdmin")) {
      setIsAdmin(true)
      setCantidadLetras(localStorage.getItem(`letrasProhibidasDeJuego${localStorage.getItem("room")}`))
      setActivo(true)
      setContador(10)
      setRonda(0)
    }
  }, [])

  useEffect(() => {
    refJugadores.current = jugadores
  }, [jugadores])

  useEffect(() => {
    if (!socket) return
    socket.emit("joinRoom", { room: room, id: id },

    )
  }, [id, room])

  useEffect(() => {
    refModal.current = isModalOpen
  }, [isModalOpen])

  useEffect(() => {
    refRonda.current = ronda
  }, [ronda])

  useEffect(()=>{
    console.log(jugadores)
  }, [jugadores])

  // //cada vez que te llega el , evento de cambio de ronda + al inicio
  useEffect(() => {
    if (!socket) return;
    socket.on("cambioRondaReceive", data => {
      if (refModal.current) {
        closeModal()
      }
      if (id == localStorage.getItem("idAdmin")) {
          setRonda(data.ronda)
          setLetrasprohibidas([])
          setPrevPalabra("")
          setJugadores(data.jugadores)
          const letras = "abcdefghijklmnñopqrstuvwxyz"
          const auxiliar = []
          for (let i = 0; i < cantidadLetras; i++) {
            const indiceAleatorio = Math.floor(Math.random() * letras.length);
            auxiliar.push(letras.charAt(indiceAleatorio));
          }
          socket.emit("cambioTurnoSend", { index: -1, jugadores: refJugadores.current, palabra: "", letrasProhibidas: auxiliar, ronda: data.ronda })// hay que hacer que el admin no juegue en la ronda inicial siempre//mensaje en socketTurno
         setContador(10)
      }
    }
    )
    socket.emit("cambioRondaSend", { jugadores: refJugadores.current, ronda: ronda })
  }, [socket, id, room /**Aca iba socketRonda en vez de socket */])

  useEffect(() => {
    console.log("Esta es la ronda, ", ronda)
  }, [ronda])

  // //terminar partida
  useEffect(() => {
    if (!socket) return;
    socket.on("terminarPartidaReceive", data => {

      if (isAdmin){
        const accion = () => { router.replace('../SalaEspera', { scroll: false }), socket.emit("") };
        openModal("Partida Finalizada", { accion: accion })
      }
      setJugadores(data.jugadores)
      //Modal de fin de partida + resultados
      //boton de ir a sala de espera
      //El siguiente codigo se ejecuta al iniciar la partida
    })
    if (!socket) return
    socket.on("joined_OK_room", data => {})
  }, [socket])
  // socket.emit("cambioRondaSend", { jugadores: jugadores })}
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
      if (data.index >= jugadores.length) {
        socket.emit("cambioTurnoSend", { jugadores: data.jugadores, index: -1, letrasProhibidas: data.letrasProhibidas, ronda: data.ronda, palabra: data.palabra })
        setContador(1000000000000000)
      } else if (jugadores[data.index].id_usuario == id) {
        console.log("En cambioturnoreceive se setea la ronda a ", data.ronda)
        setRonda(data.ronda)
        setPalabra("")
        setLetrasprohibidas(data.letrasProhibidas)
        setActivo(true)
        setPrevPalabra(data.palabra)
        setJugadores(data.jugadores)
        setContador(10)
      } else {
        setActivo(false)
      }
    })
  }, [socket /**Aca iba socketTurno en vez de socket */])


  useEffect(() => {
    if (!socket) return;
    socket.on("rondaTerminadaReceive", (data) => {
      if (refRonda.current == rondas) {
        socket.emit("terminarPartidaSend", { jugadores: refJugadores.current })
      } else {
        setJugadores(data.jugadores)
        setContador(10)
        const accion = () => { socket.emit("cambioRondaSend", { jugadores: refJugadores.current, ronda: refRonda.current }) }
        if (isAdmin) {
          openModal("Se ha terminado la ronda", { accion: accion });
        } else {
          openModal("Se hay terminado la ronda")
        }
      }
    })
  }, [socket])

  //Esto va en el onchange del input
  async function envioPalabra() {
    if (prevPalabra.length < palabra.length) {
      let valid = await checkearPalabra(palabra)//fetch de palabras o comprobacion si la palabra existe-es valida
      if (valid) {
        let index
        setPalabraMasCorta(false)
        for (let i = 0; i < jugadores.length; i++) {
          if (jugadores[i].id_usuario == id) {
            index = i
            jugadores[i].puntos += palabra.length;
            setJugadores((prevArray) => [...prevArray, {}])
            setJugadores((prevArray) => prevArray.slice(0, -1))
            break; // corta el bucle si ya lo encontró
          }

        }
        if (!socket) return;
        socket.emit("cambioTurnoSend", { index: index, jugadores: refJugadores.current, palabra: palabra, letrasProhibidas: letrasprohibidas, ronda: ronda })
        setContador(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)
        setActivo(false)
      } else {
        setPalabraMasCorta(false)
        setPalabraNoExiste(true)
      }
    } else {
      setPalabraNoExiste(false)
      setPalabraMasCorta(true)
    }
  }

  function cambiarPalabra(event) {
    setPalabra(event.target.value)
  }

  function checkLetra(event) {
    let letra = event.key
    for (let i = 0; i < letrasprohibidas.length; i++) {
      if (letrasprohibidas[i] == letra.toLowerCase()) {
        event.preventDefault()
      }
    }
  }

  //TIMER
  useEffect(() => {
    //Esto usa timers temporales de 1 segundo en vez de uno de 10. Cuando llega a 0 no se crean más timers.
    if (isModalOpen == false) {
      if (contador > 0) {
        const timer = setInterval(() => {
          setContador(contadorPrevio => contadorPrevio - 1);
        }, 1000);

        return () => {
          clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonta o el contador cambia
        }
      } else {
        for (let i = 0; i < jugadores.length; i++) {


          if (jugadores[i].id_usuario == id && activo) {
            if(jugadores[i].puntos >=10){
              jugadores[i].puntos -= 10;
              setJugadores((prevArray) => [...prevArray, {}])
              setJugadores((prevArray) => prevArray.slice(0, -1))
              break; // corta el bucle si ya lo encontró
            }else{
              jugadores[i].puntos = 0;
              setJugadores((prevArray) => [...prevArray, {}])
              setJugadores((prevArray) => prevArray.slice(0, -1))
              break; // corta el bucle si ya lo encontró
            }
          }


        }
        socket.emit("rondaTerminadaSend", { room, jugadores: refJugadores.current });
        //nova
        //que se ejecute el socket y que de ahi se abra el modal . manda la variable admin, yta en el modacompruieba si es true. solo al admin le aparece el nboton para el boton de cambio de ronda y de ahi empieza
      }
    }
  }, [contador, activo, isModalOpen]);
  return (
    <>

    {activo &&(<>
    <div className={stylesG.expandDiv}></div>
    <div className={stylesG.expandDiv2}></div>
    <p className={stylesG.contador}>{contador}'</p></>)}

      <div className={stylesG[activo]}>
        <div className={styles.top}>
          <h3>Ronda {ronda}/{rondas}</h3>
        </div>
        <div className={stylesG.contenedorPrincipal}>

          <div className={stylesG.userPointContainer}>

            {jugadores &&
              jugadores.map((jugador, index) => {
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
            {activo && <h2 className={styles.subtitle2}>
              Longitud {prevPalabra.length + 1} o más
            </h2>}

            <div className={stylesG.inputContainer}>
              {activo == true ? (<>
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
                {palabraMasCorta && <p>La palabra debe ser mas larga que {prevPalabra.length + 1}</p>}
                {palabraNoExiste && <p>Esta palabra no existe</p>}</>
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
          admin={isAdmin}
          partidaTerminada={refRonda.current == rondas}
        />
      </div>
    </>
  );

}
