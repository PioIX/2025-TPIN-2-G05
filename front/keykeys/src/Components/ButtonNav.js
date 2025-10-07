"use client"
import styles from "@/components/ButtonNav.module.css"
//Los botones tienen que tener una accion y una imagen
export default function ButtonNav(props){
    
    return(
        <>
             <button type={props.type} onClick={props.onClick} className={styles.buttonNav}> {props.text} </button>
        </>
    )
}