import {useRouter} from 'next/navigation'
export default function Creditos(){
    router=useRouter()

    function volver(){
        router.push("../")
    }
    return(
        <div>

        <h1>Key Keys</h1>
        <p>Key Keys fué desarrollado por...</p>
        <p>Francisco Pascuet,<br/>
            Martín Tello,<br/>
            Julián Brianza,<br/>
            Juan Lucas Casanova,<br/>
            y Matías Mahlknecht.
        </p>
        <ImagenClick onClick={volver} src={"../../../keykeys/public/volver.png"}/>
        </div>

    )
}