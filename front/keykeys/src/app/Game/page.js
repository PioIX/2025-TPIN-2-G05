"use client";

import styles from "./page.module.css";
import clsx from "clsx";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import UserPoint from "@/Components/UserPoint"
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Button from "@/Components/Button";
import LetraProhibida from "@/Components/LetraProhibida";

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
  
  //codigo en eladmin y //hacer tema rondas
  useEffect(()=>{
      async function getroomadmin(){
        setRoom(localStorage.getItem(`room`))
        setId(localStorage.getItem(`idUser`))
      }
      getroomadmin()
    //conecta a la room localstorage(room)
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
        // setActivo(true) hay que hacer que el admin no juegue en la ronda inicial siempre//mensaje en socketTurno
      }
    }
  },[ronda, socketRonda])
  //terminar partida
  useEffect(()=>{
    //Modal de fin de partida + resultados//boton 
  },socketTerminarPartida)
  //cada vez que te llega el evento de cambio de turno
  useEffect(()=>{
    setJugadores(socket.jugadores)//Sus puntos y fotos
    setPrevPalabra(socket.prevpalabra)
    if(id==socket.idTurno){
      setRonda(socket.ronda)
      setPalabra("")
      //setear el input a vacio
      setLetrasprohibidas(socket.letras)
      setActivo(true)
    }else{
      //seteo de pantalla de espera gris + nombre de quien tiene el turno
      // setPlayerActive(socket.nameTurno)
    }
  },[socketTurno])
  
  //esto va en el on key down
  function checkLetra(event) {
    let letra = event.key
    for(let i =0;i<letrasprohibidas.length;i++){
      if(letrasprohibidas[i]==letra.toLowerCase()){
        event.preventDefault()
        //return manda que es invalida
      }
    }
  }
  //Esto va en el onchange del input
  async function envioPalabra() {
    if(prevPalabra.length< palabra.length){
      //let valid = fetch de palabras o comprobacion si la palabra existe-es valida
      if(valid){
        //cambia de persona en la room, le manda la palabra anterior 
        setActivo(false)
      }else{
        //palbra invalida
      }
    }else{
      // return que palabra es invalida
    }
  }
  function cambiarPalabra(event){
    setPalabra(event.target.value)
  }

  useEffect(()=>{
    // timer
  },[])

  return (
  <>
    <div className={activo}>
      {/* <></> Poner cosa del timer */}
      <h3>Ronda {ronda}</h3>
      {
        jugadores.map((jugador, index)=>{
          <UserPoint key={index} point={jugador[0]}src={jugador[1]}></UserPoint>
        })
      }
      {
        letrasprohibidas.map((letrasprohibida,index)=>{
          <LetraProhibida key={index}letra={letrasprohibida}></LetraProhibida>
        })
      }
      <h2>Longitud {prevPalabra.length+1} o mas </h2>
      <Input onClick={envioPalabra} onKeyDown={checkLetra} onChange={cambiarPalabra}></Input>
      {
        activo?true
        (<Button onClick={envioPalabra} text={"Enviar Palabra"}></Button>)
        :
        (<h2 className = {styles.subtitle}>No es tu turno</h2>)
      }
    </div>
  </>
  );
}
