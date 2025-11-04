"use client"
import clsx from "clsx"
import styles from "@/components/ImagenClick.module.css"
export default function Input(props) {
    return (
        <img 
            onClick={props.onClick} 
            src={props.src} 
            className={styles[props.className]}
        />
    );


}