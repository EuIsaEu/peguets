import { async } from '@firebase/util';
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components.module.css';

import { database } from '../api/firebase';
import { get, ref, set } from 'firebase/database';

export default function UpdateRecado({ closeRecado, loadNewData }) {
    const [aviso, setAviso] = useState(null);
    const [recado, setRecado] = useState(null);
    const [recadoVazio, setRecadoVazio] = useState(null);

    const textRef = useRef(null)
    const recadoRef = useRef(null);

    function verificarTexto() {
        setRecadoVazio(false)
        const textLength = textRef.current.value.length

        if (textLength >= 140) {
            setAviso(true)
            textRef.current.value = recado
        } else {
            setAviso(false)
            const text = textRef.current.value;
            setRecado(text);
            // console.log(textLength)
            // console.log(recado)
        }
    }

    function enviarRecado() {
        console.log(textRef.current.value.length)
        if (textRef.current.value.length >= 0) {
            const userCreds = JSON.parse(localStorage.getItem('user-credentials'))
            const userRef = ref(database, "peguets/UsersAuthList/" + userCreds.uid)

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    data.recado = recado
                    set(userRef, data).then(() => {
                        console.log("recado atualizado com sucesso!")
                        loadNewData(data)
                        fecharCropper()
                    })
                }
            })
        } else {
            setRecadoVazio(true)
        }
    }

    const fecharCropper = () => {
        recadoRef.current.style.opacity = "0"
        setTimeout(() => {
            closeRecado()
        }, 100);
    }

    useEffect(() => {
        // Desativa a rolagem quando o componente monta
        document.body.style.overflow = 'hidden';

        // Reativa a rolagem quando o componente desmonta
        return () => {
            document.body.style.overflow = '';
        };
    }, []);


    return (
        <>
            <div id={styles.bgBlack}></div>
            <div id={styles.updateRecado} ref={recadoRef}>
                <img src='icons/exit-icon.png' id={styles.exitIcon} onClick={fecharCropper}></img>
                <textarea id={styles.recadoTextArea} onInput={verificarTexto} ref={textRef}></textarea>
                <button id={styles.recadoButtonEnviar} onClick={enviarRecado}>Enviar novo recado</button>
                {aviso && (
                    <p id={styles.recadoLimite}>Limite de 140 caracteres atingido</p>

                )}
                {recadoVazio && (
                    <p id={styles.recadoVazio}>O silêncio pode ser a melhor resposta, mas, definitivamente, não é o melhor recado de perfil.</p>
                )}
            </div>
        </>

    )
}