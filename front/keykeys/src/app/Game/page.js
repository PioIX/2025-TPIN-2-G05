"use client";

import styles from "./page.module.css";
import clsx from "clsx";
// import {  } from "@/api/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
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
  const [ronda, setRonda] = useState("");
  const [activo, setActivo] = useState("");
  const router = useRouter();
  
  //codigo en eladmin
  //hacer tema rondas
  useEffect(()=>{
    //seteos
    if(id==localStorage(idAdmin)){

    }
  },[])
  //cada vez que te llega el turno
  useEffect(()=>{
    const letras = "abcdefghijklmnñopqrstuvwxyz"
    for(let i=0;i<5;i++){
      const indiceAleatorio = Math.floor(Math.random() * letras.length);
      setLetrasprohibidas((prev)=>[...prev, letras.charAt(indiceAleatorio)]) ;
    }
  },[socket])
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
