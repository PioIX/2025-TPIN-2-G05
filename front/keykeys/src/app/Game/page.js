"use client";


import clsx from "clsx";
import styles from "./game.module.css";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import UserPoint from "@/Components/UserPoint"
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Button from "@/Components/Button";
import LetraProhibida from "@/Components/LetraProhibida";
import Modal from "@/Components/Modal";
import { useSocket } from "@/hooks/useSocket";

export default function Game() {
  const [jugadores, setJugadores] = useState([]);
  const [palabra, setPalabra] = useState("");
  const [id, setId] = useState("");
  const [prevPalabra, setPrevPalabra] = useState("");
  const [room, setRoom] = useState("");
  const [letrasprohibidas, setLetrasprohibidas] = useState([]);
  const [cantidadLetras, setCantidadLetras] = useState("");
  const [rondas, setRondas] = useState("");
  const [ronda, setRonda] = useState(undefined);
  const [activo, setActivo] = useState(undefined);
  const router = useRouter();
  const { socket, isConnected } = useSocket()
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
    setRoom(localStorage.getItem(`room`))
    setId(localStorage.getItem(`idUser`))
    setJugadores(localStorage.getItem("Usuarios"))
    socket.emit("joinRoom", { room: localStorage.getItem("room"), id: localStorage.getItem("idUser") },
      console.log("Se hizo el joinRoom")
    )
    if (id == localStorage.getItem("idAdmin")) {
      setRondas(localStorage.getItem(`rondasTotalesDeJuego${room}`))
      setCantidadLetras(localStorage.getItem(`letrasProhibidasDeJuego${room}`))
      if (ronda == undefined) {
        setRonda(0)
      }
      socket.emit("iniciarDentroDeLaPartida", { })
    }
  }, [])


  //cada vez que te llega el , evento de cambio de ronda + al inicio
  useEffect(() => {
    if(!socket) return;
    socket.on("cambioRonda", data => {
      setJugadores(data.jugadores)
    })
    if (id == localStorage(idAdmin)) {
      if (ronda > rondas) {
        socket.emit("terminarPartida",{data: jugadores })
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
  }, [ronda, socketRonda])


  //terminar partida
  useEffect(() => {
    if (!socket) return;
    socket.on("terminarPartida", data => {
      setJugadores(data.jugadores)
      const accion = () => { router.replace('../SalaEspera', { scroll: false }) };
      openModal("Partida Finalizada", { accion: accion })
      //Modal de fin de partida + resultados
      //boton de ir a sala de espera
      //El siguiente codigo se ejecuta al iniciar la partida
      })
      if(!socket) return
      socket.on("iniciarDentroDeLaPartida", data =>{ //Creo que era para hacer un random del array de jugadores que le mandes
        setJugadores(data.jugadores)
      })


      if (!socket) return 
      socket.on("joined_OK_room", data =>{
        console.log("El usuario ", data.user, " se unió a la partida ", data.room)
      })
  }, [socket])


  //useEffect(()=>{
  //  if (!socket) return;
  // socket.on("cambioTurno", data =>{
  //  setJugadores(data.jugadores),
  //  setPrevPalabra(data.palabra),
  //  let index = data.index}
  //)
  //lOS SOCKET MANDAN
  //jugadores (array) contiene: objeto con (punto; foto; id;nombre) IMPORTANTE!!!! PARA SABER QUIEN VA DESPUES USA EL INDEX EN EL ARRAY DE JUGADORES, COMPROBA EL ID DEL LOCALSTORAGE CON EL ID DE USUARIO QUE TE DEVUELVE SI HACES JUGADORES[INDEX].id_usuario
  //prevPalabra (string)
  //idTurno de quien vaya (se puede poner nombre tambien)
  //ronda por la que se vaya
  //letras que estan prohibidas
  useEffect(() => {
    setPrevPalabra(socket.prevpalabra)
    if (id == socket.idTurno) {
      setRonda(socket.ronda)
      setPalabra("")
      setLetrasprohibidas(socket.letras)
      setActivo(true)
    } else {
      setActivo(false)
    }
  }, [socketTurno])



  //Esto va en el onchange del input
  async function envioPalabra() {
    if (prevPalabra.length < palabra.length) {
      //let valid = fetch de palabras o comprobacion si la palabra existe-es valida
      if (valid) {
        for (let i = 0; i < jugadores.length; i++) {
          if (jugadores[i].id == id) {
            jugadores[i].punto += palabra.length;
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
    }else{
      alert("Pasaron 10 segundos.")//ESTO SE EJECUTA CUANDO PASAN 10 SEGUNDOS.
    }
  }, [contador]);
  //TIMER



  return <>
    <Input onClick={envioPalabra} onKeyDown={checkLetra} onChange={cambiarPalabra}></Input>
    <p>{contador}</p>

  </>;

  //poner esto si termina el timer
  // for (let i=0;i<jugadores.length;i++) {
  //   if (jugadores[i].id == id) {
  //     jugadores[i].punto -= 10;
  //     break; // corta el bucle si ya lo encontró
  //   }
  // }
  //socket.emit("cambioRonda", {data:jugadores})

  useEffect(() => {
    // timer
  }, [])

  return (
    <>
      <div className={activo}>
        {/* <></> Poner cosa del timer */}
        <h3>Ronda {ronda}</h3>
        {
          jugadores.map((jugador, index) => {
            <UserPoint key={index} point={jugador.puntos} src={jugador.foto}></UserPoint>
          })
        }
        {
          letrasprohibidas.map((letrasprohibida, index) => {
            <LetraProhibida key={index} letra={letrasprohibida}></LetraProhibida>
          })
        }
        <h2>Longitud {prevPalabra.length + 1} o mas </h2>
        {
          activo ?
            (<><Input onClick={envioPalabra} onKeyDown={checkLetra} onChange={cambiarPalabra}></Input>
              <Button onClick={envioPalabra} text={"Enviar Palabra"}></Button></>)
            :
            (<h2 className={styles.subtitle}>No es tu turno</h2>      //opcional// setPlayerActive(socket.nameTurno)
            )
        }
        {/* Modal Component */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          mensaje={modalMessage}
          jugadores={jugadores}
          action={modalAction || null} // Si modalAction está vacío, pasa null
        />
      </div>
    </>
  );
}
