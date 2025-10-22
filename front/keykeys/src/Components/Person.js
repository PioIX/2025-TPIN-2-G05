"use client"
import styles from "@/Components/Person.module.css"
//deben tener una foto y nombre
export default function Person(props){
    
    return(
        <div className={styles.container}>
            <img 
                src={props.src} 
                className={styles.image}
            />
            <p className={styles.text}>{props.text}</p>        
        </div>
    )
}