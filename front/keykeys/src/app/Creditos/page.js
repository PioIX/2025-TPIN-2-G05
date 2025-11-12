"use client"

import Volver from '@/Components/Volver'
import styles from '@/app/page.module.css'

export default function Creditos() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>KEYKEYS</h1>

            <div className={styles.textContainer}>
                <h2 className={styles.subtitle2}>Créditos</h2>
                <p className={styles.subtitle}>KeyKeys fue desarrollado por:</p>

                <p className={styles.red}>
                    Francisco Pascuet<br />
                    Martín Tello<br />
                    Julián Brianza<br />
                    Juan Lucas Casanova<br />
                    Matías Mahlknecht
                </p>

                <p className={styles.rest}>
                    Proyecto realizado con Next.js y amor por el código.
                </p>
            </div>

            <div className={styles.center}>
                <Volver />
            </div>
        </div>
    )
}