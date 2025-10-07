"use client"
import styles from "@/components/Button.module.css"
//Los botones tienen que tener una accion y una imagen
export default function Button(props){
    
    return(
        <>
             <button type={props.type} onClick={props.onClick} className={props.className}> {props.text} </button>
        </>
    )
}