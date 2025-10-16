"use client";
import ImagenClick from "@/Components/ImagenClick";
import styles from "./Input.module.css"; 

export default function Input(props) {
  return (
    <div className={props.classNameInputWrapper}>
      <input
        className={props.classNameInput}   
        placeholder={props.placeholder}
        onChange={props.onChange}
        type={props.type || "text"}
        value ={props.value}
        onKeyDown={props.onKeyDown}
      />
      {props.src && (
        <div className={styles.iconWrapper}>
        <ImagenClick
          onClick={props.onClick}
          src={props.src}
          className={styles.icon} 
        />
        </div>
      )}
    </div>
  );
}