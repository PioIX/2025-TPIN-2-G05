"use client";

import styles from "./page.module.css";
import clsx from "clsx";
// import {  } from "@/API/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import Input from "@/Components/Input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/Components/Button";

export default function Game() {
  const [jugadores, setJugadores] = useState([]); 
  const [id, setId] = useState("");
  const [rondas, setRondas] = useState("");
  const [letrasProhibidas, setLetrasprohibidas] = useState("");
  const router = useRouter();
  
  //codigo en eladmin y //hacer tema inicio
  useEffect(()=>{
    //id de persona setId(localstorage(idUser))
    //conecta a la room localstorage(room)
    if(id==localStorage(idAdmin)){ //que idAdmin sea el id-sala
      //set Button de start partida
    }
  },[])

    //cada vez que te llega el evento de nuevo jugador en sala
  useEffect(()=>{
    //setJugadores(jugadorSala)
  },[jugadorSala])
    useEffect(()=>{
      localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
      localStorage.setItem(`letrasProhibidasDeJuego${room}`, letrasProhibidas)
      localStorage.setItem(`idAdmin`, idAdmin)
      localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
      //router a la page game
  },[socketPlay])

  //inicio de partida
  function partidaInit(){
    //mandar socket en localstorage(rondas) (letrasProhibidas) (admin) (idUser) (room)
    //envia evento por socket de inicio de partida con lo anterior + mandar a la pagina de juego
  }

  return <>
    {
        //coso de ver jugadores en sala de espera Depende de Juagdor Sala
        // crear componente jugador con nombre y estado
    }    
    {/* Condicional si es admin 
        lista de cantidad de rondas //elige cuantas rondas quiere jugar y cambia la variable rondas
        lista de letras prohibidas //elige cuantas letras prohibidas y las guarda en una variable
        <Button onClick={partidaInit} text={"Inicie partida"}/> 
    */}
    {/* Boton salirse de la sala */}
  </>;
}