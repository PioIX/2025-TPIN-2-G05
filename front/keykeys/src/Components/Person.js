"use client"
import styles from "@/Components/Person.module.css"
//deben tener una foto y nombre
export default function Person({ nombre, foto }) {
  // Convertir los datos binarios a base64
  const base64Image = foto?.data ? Buffer.from(foto.data).toString('base64') : null;
  const imageUrl = base64Image ? `data:image/png;base64,${base64Image}` : '/sesion.png';

  return (
    <div className={styles.personContainer}>
      <img 
        src={imageUrl}
        alt={nombre}
        className={styles.personImage}
      />
      <span className={styles.personName}>{nombre}</span>
    </div>
  );
}