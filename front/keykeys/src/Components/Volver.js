"use client"
import ImagenClick from '@/Components/ImagenClick'
import {useRouter} from 'next/navigation'
export default function Volver(){
    const router=useRouter()
    function volver(){
        router.push("../")
    }
    return(<ImagenClick onClick={volver} src={"/volver.png"}/>)
}