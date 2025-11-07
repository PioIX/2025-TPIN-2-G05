"use client"
import styles from "@/Components/Button.module.css"
//Los botones tienen que tener una accion y una imagen
export default function Button(props){
    
    return(
        <>
            <button type={props.type} onClick={props.onClick} className={styles[props.className]} onKeyDown={props.onKeyDown? props.onKeyDown:null}> {props.text} </button>
        </>
    )
}