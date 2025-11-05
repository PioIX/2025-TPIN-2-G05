"use client";
import styles from "@/Components/LetraProhibida.module.css"; 

export default function LetraProhibida(props) {
  return (
    <div className={styles[props.className]}>
      <h2>{props.letra}</h2>
    </div>
  );
}