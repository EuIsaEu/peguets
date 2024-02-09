import Head from 'next/head'
import { useEffect } from 'react'
import styles from '@/styles/Home.module.css'
import Header from './componentes/Header'

import { app } from "./api/firebase"
import { getDatabase, ref, set } from "firebase/database";


export default function Home() {

  function writeUserData() {
    const db = getDatabase(app);
    set(ref(db, 'users/userId'), {
      username: 'nome',
      email: 'email',
      profile_picture: 'imageUrl'
    });
  }

  useEffect(() => {
    //inicia o carrossel
    iniciarFotos();

    const loading = setTimeout(() => {
      const elem = document.getElementById(styles.loading)
      elem.style.opacity = '0';
      setTimeout(() => {
        elem.style.display = 'none'
      }, 1000);
    }, 1000);

    //função das fotos
    function iniciarFotos() {
      let imagemAtiva = 0;
      var imagens = document.querySelectorAll(".fotosCarrossel")
      imagens = Array.from(imagens)

      imagens[imagemAtiva].dataset.ativo = 'true'

      setInterval(function () {
        imagens[imagemAtiva].dataset.ativo = ''
        imagemAtiva = (imagemAtiva + 1) % imagens.length
        imagens[imagemAtiva].dataset.ativo = 'true'

      }, 5000)
    }

  }, [])


  return (
    <>
      <Head>
        <title>Peguets</title>
      </Head>
      <div id={styles.loading}>
        <img src='heart-icon.png'></img>
        <h1>Peguets</h1>
      </div>
      <Header></Header>
      <div id={styles.container}>
        <div id={styles.fotos}>
          <img src='/carrossel/laura-um.png' className='fotosCarrossel'></img>
          <img src='/carrossel/laura-leticia.png' className='fotosCarrossel'></img>
          <img src='/carrossel/laura-tres.png' className='fotosCarrossel'></img>
          <img src='/carrossel/leticia-um.png' className='fotosCarrossel'></img>
          <img src='/carrossel/laura-dois.png' className='fotosCarrossel'></img>
          <img src='/carrossel/laura-eu.png' className='fotosCarrossel'></img>
        </div>
        <div id={styles.sobre}>
          <div id={styles.sobreLetras}>
            <h3 id={styles.sobreFrase}>O MELHOR SITE DO MUNDO</h3>
          </div>
          <h1>sobre</h1>
          <p><b>Peguets</b> é um site de relacionamento de trouxas... <b>e só deles 🙌✨</b></p>
          <a href='login'>Faz login logo 💜🤫</a>
        </div>
        <div id={styles.nos}>
          <h1>✨A EQUIPE ✨</h1>
          <div id={styles.laura} className={styles.nosBloco}>
            <div id={styles.bgBlack}>
              <h2>Laura</h2>
            </div>
            <div id={styles.nosTexto}>
              <h3>Laura Trindade</h3>
              <p>Um pouco desajeitada, mas, provavelmente é a melhor de nós</p>
            </div>
            <img src='nos/laura.png'></img>
          </div>
          <div id={styles.leticia} className={styles.nosBloco}>
            <div id={styles.bgBlack}>
              <h2>Leticia</h2>
            </div>
            <div id={styles.nosTexto}>
              <h3>Leticia Marques</h3>
              <p>A mais insuportavel, só tenho isso a dizer...</p>
              {/* na verdade, até que gosto dela, só não espalha isso */}
            </div>
            <img src='nos/leticia.png'></img>
          </div>
          <div id={styles.isa} className={styles.nosBloco}>
            <div id={styles.bgBlack}>
              <h2>Isa</h2>
            </div>
            <div id={styles.nosTexto}>
              <h3>Eu uai</h3>
              <p>Claramente eu</p>
            </div>
            <img src='nos/isa.png'></img>
          </div>
        </div>
        <div id={styles.mais}>
          <h3>Talvez eu coloque mais coisas aqui no futuro, deem ideias</h3>
        </div>
      </div>
    </>
  )
}
