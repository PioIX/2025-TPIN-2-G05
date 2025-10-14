"use client";

import styles from "./page.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
// import {  } from "@/api/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Game() {
  // const [jugadores, setJugadores] = useState([]); depende de como hagamos la sala
  const [palabra, setPalabra] = useState("");
  const [prevPalabra, setPrevPalabra] = useState("");
  const [letrasprohibidas, setLetrasprohibidas] = useState([]);
  const [rondas, setRondas] = useState("");
  const [ronda, setRonda] = useState("");
  const router = useRouter();

  //hacer tema rondas

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
  async function envioPalabra(event) {
    if(prevPalabra.length< palabra.length){
      //let valid = fetch de palabras o comprobacion si la palabra existe-es valida
      if(valid){
        //cambia de persona en la room, le manda la palabra anterior 
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
  </>;
}
