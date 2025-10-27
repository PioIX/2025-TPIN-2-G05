"use client"
import styles from "@/Components/UserPoint.module.css"
import clsx from "clsx";
import { useState } from "react";
import { resume } from "react-dom/server";
//deben tener una foto y puntos
export default function Person(props) {
    const [result, setResult] = useState([]);

    function generateArray(number) {
        let result = [];
        while (number >= 10) {
            result.push(10);
            number -= 10;
        }
        while (number >= 5) {
            result.push(5);
            number -= 5;
        }
        while (number >= 3) {
            result.push(3);
            number -= 3;
        }
        while (number >= 1) {
            result.push(1);
            number -= 1;
        }
        console.log(result)
        return result;

    }
    return (
        <div className={styles.container}>
            {
                /* stars  */
                generateArray(props.point).reverse().map((point, index) => {
                    return <img
                        key={index}
                        className={styles.star}
                        src={`/estrella_${point}.png`}
                    />
                })}
            <img
                src={props.src}
                className={styles.image}
            />
        </div>
    )
}