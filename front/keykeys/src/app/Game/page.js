"use client";

import styles from "./page.module.css";
import clsx from "clsx";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Game() {
  // const [jugadores, setJugadores] = useState([]); depende de como hagamos la sala
  const [palabra, setPalabra] = useState("");
  const [id, setId] = useState("");
  const [prevPalabra, setPrevPalabra] = useState("");
  const [letrasprohibidas, setLetrasprohibidas] = useState([]);
  const [rondas, setRondas] = useState("");
  const [ronda, setRonda] = useState(undefined);
  const [activo, setActivo] = useState(undefined);
  const router = useRouter();
  
  //codigo en eladmin y //hacer tema rondas
  useEffect(()=>{
    //id de persona setId(localstorage(idUser))
    //conecta a la room localstorage(room)
    if(id==localStorage(idAdmin)){ 
      // setRondas(localStorage(rondas))
      if(ronda==undefined){
        setRonda(1)
      }
      setActivo(true)
    }
  },[])
    //cada vez que te llega el , evento de cambio de ronda + al inicio
  useEffect(()=>{
    if(id==localStorage(idAdmin)){   
      if(ronda>rondas){
        //termina la partida
      }else{
        setRonda(ronda+1)
        setLetrasprohibidas([])
        setPrevPalabra("")
        const letras = "abcdefghijklmnñopqrstuvwxyz"
        for(let i=0;i<5;i++){
          // setActivo(true) hay que hacer que el admin no juegue en la ronda inicial siempre//mensaje en socketTurno
          const indiceAleatorio = Math.floor(Math.random() * letras.length);
          setLetrasprohibidas((prev)=>[...prev, letras.charAt(indiceAleatorio)]) ; 
        }
      }
    }
  },[ronda, socketRonda])
  //cada vez que te llega el evento de cambio de turno
  useEffect(()=>{
    if(id==socket.idTurno){
      setPrevPalabra(palabra)
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
  //hacer tema partida
  
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

  return <>
    <Input onClick={envioPalabra} onKeyDown={checkLetra} onChange={cambiarPalabra}></Input>
  </>;
}
