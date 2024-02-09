import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import styles from '@/styles/Registro.module.css'

import { getDatabase, ref, set, get } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "./api/firebase"
import { app } from "./api/firebase"

export default function Registro() {
    const nomeRef = useRef(null)
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        const registrarUsuario = async () => {

            const nome = nomeRef.current.value;
            const email = emailRef.current.value;
            const password = passwordRef.current.value;

            if (email != null && nome != null && password != null && password.length > 8) {
                await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {

                    const userDbRef = ref(database, 'peguets/UsersAuthList/' + userCredential.user.uid);
                    const userObj = {
                        nome: nome,
                        profilePicURL: "https://firebasestorage.googleapis.com/v0/b/sage-duck.appspot.com/o/peguets%2FusersProfilePics%2Fprofile-icon.png?alt=media&token=592cc04a-da1a-4338-a9a6-14c2c239972b",
                        recado: "Olá! +insira o nome registrado+! Meus amigos me chamam de RONB1NT5CAT5CO, e carregar essa página utilizou <b>0,5 WATTS</b> da sua bateria! °-°",
                        peguets: 0,
                        karma: 0,
                        nota: 0,
                        postagens: 0
                    }

                    set(userDbRef, userObj).then(() => {
                        //colocar o redirecionamento dentro do .then do set(), já que é preciso esperar
                        const userObjLocal = {
                            nome: nome,
                            userId: userCredential.user.uid
                        }

                        localStorage.setItem("user-info", JSON.stringify(userObjLocal))
                        localStorage.setItem("user-credentials", JSON.stringify(userCredential.user))
                        window.location.href = '/profile'
                    })

                }).catch((error) => {
                    console.error("Erro: ", error)
                    if (error.code === "auth/invalid-email") {
                        alert("O endereço de e-mail fornecido é inválido.");
                    }
                })

            }
        }

        const handleClick = async () => {
            await registrarUsuario();
        };

        document.getElementById(styles.button).addEventListener('click', handleClick)

        return () => {
            document.getElementById(styles.button).removeEventListener('click', handleClick);
        }

    }, [])

    return (
        <div id={styles.container}>
            <Head>
                <title>O registro das lindas</title>
            </Head>
            <div id={styles.registrar}>
                <div id={styles.logo}>
                    <img src='heart-icon.png'></img>
                </div>
                <div id={styles.inputs}>
                    <input type="text" placeholder='Nome de usuario' ref={nomeRef}></input>
                    <input type="text" placeholder='Email' ref={emailRef}></input>
                    <input type="password" placeholder='Senha' ref={passwordRef}></input>
                    <button id={styles.button}>Registrar</button>
                    <ul>
                        <li>Use um endereço de email válido</li>
                        <li>Senha precisa ser maior que 8 caracteres</li>
                    </ul>
                    <p>Já possui uma conta? Trouxaaaa <br></br><a href='login'>Vai logar!</a></p>
                </div>
            </div>
        </div>
    )
}