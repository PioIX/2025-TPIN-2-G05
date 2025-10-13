"use client";

import styles from "./page.module.css";
import clsx from "clsx";
import Input from "@/Components/Input";
// import {  } from "@/api/fetch"; //REEMPLAZAR CON EL FETCH CORRESPONDIENTE
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Game() {
  const [jugadores, setJugadores] = useState([]);
  const [letrasprohibidas, setLetrasprohibidas] = useState([]);
  const [rondas, setRondas] = useState("");
  const [ronda, setRonda] = useState("");
  const router = useRouter();

  useEffect(()=>{
    // timer
  },[])

  return <></>;
}
