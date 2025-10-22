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
  //codigo en eladmin y //hacer tema inicio
  useEffect(()=>{
    setId(localstorage.getItem(idUser))
    //conecta a la room localstorage(room)
    if(id==localStorage.getItem(idAdmin)){
      //set Button de start partida
    }
  },[])
    //cada vez que te llega el evento de nuevo jugador en sala
  useEffect(()=>{
    setJugadores(socket.jugadorSala)
  },[socketjugadorSala])
    useEffect(()=>{
      localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
      localStorage.setItem(`letrasProhibidasDeJuego${room}`, letrasProhibidas)
      localStorage.setItem(`idAdmin`, idAdmin)
      localStorage.setItem(`idUser`, id)
      localStorage.setItem(`room`, room)
      localStorage.setItem(`rondasTotalesDeJuego${room}`, rondas)
      router.replace('../Game', { scroll: false })
  },[socketPlay])

  //inicio de partida
  function partidaInit(){
    //mandar socket en rondas letrasProhibidas admin idUser room
  }
  function salirSala(){
    localStorage.setItem(`idAdmin`, -1)
    localStorage.setItem(`room`, -1)
    openModal("Saliendo de la sala",router.replace('../Home', { scroll: false }))
    //salir de la sala
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
    {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        mensaje={modalMessage}
        action={modalAction || null} // Si modalAction está vacío, pasa null
      />   
  </>;
}