"use client"
import styles from "@/Components/UserPoint.module.css"
//deben tener una foto y puntos
export default function Person(props){
    
    return(
        <div className={styles.container}>
            {/* stars  */}
            <img 
                src={props.src} 
                className={styles.image}
            />     
        </div>
    )
}