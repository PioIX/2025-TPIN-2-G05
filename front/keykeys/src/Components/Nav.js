import ButtonNav from "@/components/ButtonNav";
import styles from "@/components/Nav.module.css";
import { useRouter } from "next/navigation";

export default function Nav() {
    const router = useRouter()
    function directionRegister() {
        router.push('/Registro', { scroll: true })
    }

    function directionLogin() {
        router.push('/', { scroll: true })
    }

    return (
        <>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <ButtonNav text="Iniciar sesión" onClick = {directionLogin}></ButtonNav>
                    <ButtonNav text="Registrarse" onClick={directionRegister}></ButtonNav>
                </ul>
            </nav>
        </>
    )
} 