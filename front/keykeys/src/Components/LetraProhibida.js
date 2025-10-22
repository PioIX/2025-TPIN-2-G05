"use client";
import styles from "@Components/LetraProhibida.module.css"; 

export default function LetraProhibida(props) {
  return (
    <div className={styles[props.letraWrap]}>
      <h2>{props.letra}</h2>
    </div>
  );
}