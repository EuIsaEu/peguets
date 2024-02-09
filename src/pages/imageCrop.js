import { useState } from "react"
import CropImage from "./componentes/cropImage"
import UpdateRecado from "./componentes/updateRecado"

import { auth, database } from "./api/firebase"
import { get, ref as dataRef, set } from "firebase/database"


export default function imageCrop() {
    const [cropOpen, setCropOpen] = useState(false);
    const [recadoOpen, setRecadoOpen] = useState(false);

    function teste() {
        console.log("funciona")
    }

    return (
        <>
            <button onClick={() => { setCropOpen(true) }}>abrir</button>
            {cropOpen && (
                <CropImage closeCrop={() => { setCropOpen(false) }}></CropImage>
            )}

            <hr></hr>

            <button onClick={() => { setRecadoOpen(true) }}>Mudar recado</button>
            {recadoOpen && (
                <UpdateRecado closeRecado={() => { setRecadoOpen(false) }} teste={() => { teste() }}></UpdateRecado>
            )}
            <br></br>
            <br></br>
            <ul>
                <li>
                    <a href="/profile">Profile</a>
                </li>
            </ul>

        </>
    )
}