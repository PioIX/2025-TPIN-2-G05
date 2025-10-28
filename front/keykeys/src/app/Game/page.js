"use client";


import clsx from "clsx";
import styles from "./page.module.css";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import UserPoint from "@/Components/UserPoint"
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/Components/Button";
import LetraProhibida from "@/Components/LetraProhibida";
import Modal from "@/Components/Modal";

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
  const [contador, setContador] = useState(10)


  const [modalMessage, setModalMessage] = useState("");  
  const [modalAction, setModalAction] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal(mensaje,action){
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
  useEffect(()=>{
      async function getroomadmin(){
        setRoom(localStorage.getItem(`room`))
        setId(localStorage.getItem(`idUser`))
      }
      getroomadmin()
    //conecta a la room
    if(id==localStorage(idAdmin)){ 
      setRondas(localStorage.getItem(`rondasTotalesDeJuego${room}`))
      setCantidadLetras(localStorage.getItem(`letrasProhibidasDeJuego${room}`))
      if(ronda==undefined){
        setRonda(1)
      }
      setActivo(true)//hacer q no siempre sea el admin
    }
  },[])


    //cada vez que te llega el , evento de cambio de ronda + al inicio
  useEffect(()=>{
    if(id==localStorage(idAdmin)){   
      if(ronda>rondas){
        //evento de socket //termina la partida 
      }else{
        setRonda(ronda+1)
        setLetrasprohibidas([])
        setPrevPalabra("")
        const letras = "abcdefghijklmnñopqrstuvwxyz"
        for(let i=0;i<cantidadLetras;i++){
          const indiceAleatorio = Math.floor(Math.random() * letras.length);
          setLetrasprohibidas((prev)=>[...prev, letras.charAt(indiceAleatorio)]) ; 
        }
        setActivo(true)// hay que hacer que el admin no juegue en la ronda inicial siempre//mensaje en socketTurno
      }
    }
  },[ronda, socketRonda])


  //terminar partida
  useEffect(()=>{
    const accion = () => {router.replace('../SalaEspera', { scroll: false })}; 
    openModal("Partida Finalizada",{accion: accion})
    //Modal de fin de partida + resultados
    //boton de ir a sala de espera
  },socketTerminarPartida)


  //cada vez que te llega el evento de cambio de turno
    //lOS SOCKET MANDAN
      //jugadores (array) contiene: objeto con (punto; foto; id;nombre)
      //prevPalabra (string)
      //idTurno de quien vaya (se puede poner nombre tambien)
      //ronda por la que se vaya
      //letras que estan prohibidas
  useEffect(()=>{
    setJugadores(socket.jugadores)
    setPrevPalabra(socket.prevpalabra)
    if(id==socket.idTurno){
      setRonda(socket.ronda)
      setPalabra("")
      setLetrasprohibidas(socket.letras)
      setActivo(true)
    }else{
      setActivo(false)
    }
  },[socketTurno])


  
  //Esto va en el onchange del input
  async function envioPalabra() {
    if(prevPalabra.length< palabra.length){
      //let valid = fetch de palabras o comprobacion si la palabra existe-es valida
      if(valid){
        for (let i=0;i<jugadores.length;i++) {
          if (jugadores[i].id == id) {
            jugadores[i].punto += palabra.length;
            break; // corta el bucle si ya lo encontró
          }
        }
        //mensaje socket de cambio de ronda
      }else{
        //palabra invalida
      }
    }else{
      // return que palabra es invalida
    }
  }


  //esto va en el on key down
  function checkLetra(event) {
    let letra = event.key
    for(let i =0;i<letrasprohibidas.length;i++){
      if(letrasprohibidas[i]==letra.toLowerCase()){
        event.preventDefault()
      }
    }
  }
  function cambiarPalabra(event){
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
    // socket de terminar partida

  return (
  <>
    <div className={activo}>
      {/* <></> Poner cosa del timer */}
      <h3>Ronda {ronda}</h3>
      {
        jugadores.map((jugador, index)=>{
          <UserPoint key={index} point={jugador.puntos}src={jugador.foto}></UserPoint>
        })
      }
      {
        letrasprohibidas.map((letrasprohibida,index)=>{
          <LetraProhibida key={index}letra={letrasprohibida}></LetraProhibida>
        })
      }
      <h2>Longitud {prevPalabra.length+1} o mas </h2>
      {
        activo?
        (<><Input onClick={envioPalabra} onKeyDown={checkLetra} onChange={cambiarPalabra}></Input>
        <Button onClick={envioPalabra} text={"Enviar Palabra"}></Button></>)    
        :
        (<h2 className = {styles.subtitle}>No es tu turno</h2>      //opcional// setPlayerActive(socket.nameTurno)
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
