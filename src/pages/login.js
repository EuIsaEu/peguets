import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import styles from '@/styles/Registro.module.css'

import { getDatabase, get, ref, child } from "firebase/database";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./api/firebase";
import { app } from "./api/firebase";

export default function Registro() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        const logarUsuario = async () => {

            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const db = getDatabase(app)

            if (email != null && password != null) {
                await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    console.log(userCredential.user.uid)
                    const userDbRef = ref(db, 'peguets/UsersAuthList/' + userCredential.user.uid);

                    get(userDbRef).then((snapshot) => {
                        if (snapshot.exists) {
                            var data = snapshot.val()

                            const userObj = {
                                nome: data.nome,
                                profilePicURL: data.profilePicURL,
                                recado: data.recado,
                                userId: user.uid
                            }

                            localStorage.setItem("user-info", JSON.stringify(userObj))
                            localStorage.setItem("user-credentials", JSON.stringify(userCredential.user))
                            window.location.href = '/feed'
                        }
                    })
                }).catch((error) => {
                    console.log("Erro: ", error)
                })
            }
        }

        const handleClick = async () => {
            await logarUsuario();
        };

        document.getElementById(styles.button).addEventListener('click', handleClick)

        return () => {
            document.getElementById(styles.button).removeEventListener('click', handleClick);
        }

    }, [])

    return (
        <div id={styles.container}>
            <Head>
                <title>Faça seu login</title>
            </Head>
            <div id={styles.registrar}>
                <div id={styles.logo}>
                    <img src='heart-icon.png'></img>
                </div>
                <div id={styles.inputs}>
                    <input type="text" placeholder='Email' ref={emailRef}></input>
                    <input type="password" placeholder='Senha' ref={passwordRef}></input>
                    <button id={styles.button}>Login</button>
                    <ul>
                        <li>Lembra do email válido?</li>
                        <li>Ah, e da senha maior que 8 caracteres? Melhor não ter esquecido dela!🫵</li>
                    </ul>
                    <p>Ainda não possui conta? Que ridiculo! <a href='registro'>Faça agora!</a></p>
                </div>
            </div>
        </div>
    )
}