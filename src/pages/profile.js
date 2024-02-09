import Head from 'next/head'
import styles from "@/styles/profile.module.css"
import { useState, useEffect, useRef } from "react"
import CropImage from "./componentes/cropImage"
import UpdateRecado from './componentes/updateRecado'

import { auth, database } from "./api/firebase"
import { get, ref as dataRef, set } from "firebase/database"
import { onAuthStateChanged } from "firebase/auth";


export default function profile() {
    const [deslogado, setDeslogado] = useState(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [cropType, setCropType] = useState(null);
    const [userObj, setUserObj] = useState(null);
    const [recadoOpen, setRecadoOpen] = useState(false);
    const [postsList, setPostsList] = useState([]);

    // const [userName, setUserName] = useState();

    const titleRef = useRef(null);
    const nameRef = useRef(null);
    const recadoRef = useRef(null);

    const loadingRef = useRef(null)

    function loadNewData(data) {
        console.log(data)
        setUserObj(data)
    }

    function loadNewPeguet(postagem) {
        if (postsList != null) {
            var array = [...postsList];
            array.push(postagem)
            console.log(array)
            setPostsList(array)
        }else{
            var array = [];
            array.push(postagem)
            setPostsList(array)
        }
    }


    useEffect(() => {
        setPostsList([])
        const user = JSON.parse(localStorage.getItem("user-credentials"));
        const userId = user.uid;

        const userPostsRef = dataRef(database, "peguets/UsersAuthList/" + userId + "/postagens");

        get(userPostsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const posts = snapshot.val();
                const postsArray = Object.keys(posts)
                var array = []

                postsArray.map((post) => {
                    // console.log(postsArray)
                    // console.log(posts[post])
                    array.push(posts[post])
                })
                setPostsList(array)
            } else {
                setPostsList(null)
            }
        })

        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user-credentials"))

                if (user) {
                    const userUid = user.uid;
                    // console.log(userUid)

                    const userRef = dataRef(database, "/peguets/UsersAuthList/" + userUid)

                    get(userRef).then((snapshot) => {
                        if (snapshot.exists()) {
                            setUserObj(snapshot.val())
                        }
                    })

                } else {
                    setDeslogado(true)
                }

            } catch (error) {
                console.error("erro: ", error)
            }

        }

        if (userObj === null) {
            fetchData()
        }


    }, [])

    return (
        <>
            <Head>
                {userObj ? (
                    <title ref={titleRef}>{userObj.nome}</title>
                ) : (
                    <title ref={titleRef}>Carregando...</title>
                )}
            </Head>

            {recadoOpen && (
                <UpdateRecado closeRecado={() => { setRecadoOpen(false); }} loadNewData={(data) => { loadNewData(data) }}></UpdateRecado>
            )}
            {cropOpen && (
                <CropImage closeCrop={() => { setCropOpen(false); }} loadNewData={(data) => { loadNewData(data) }} loadNewPeguet={(postagem) => { loadNewPeguet(postagem) }} cropType={cropType}></CropImage>
            )}

            <div id={styles.profile}>
                {userObj ? (
                    <>
                        <div id={styles.profileInfos}>
                            <div id={styles.pfpDiv}>
                                <img id={styles.profileIcon} src={userObj.profilePicURL}></img>
                                <label htmlFor={styles.updatePfp}>
                                    <img src="icons/image-icon.png"></img>
                                </label>
                                <input id={styles.updatePfp} onClick={() => { setCropOpen(true); setCropType("submitProfilePic") }}></input>
                            </div>
                            <h1 id={styles.profileNome} ref={nameRef}>{userObj.nome}</h1>
                            <h3 id={styles.profileRecado} ref={recadoRef}>{userObj.recado}</h3>
                            <button id={styles.mudarRecadoButton} onClick={() => { setRecadoOpen(true) }}>Mudar recado</button>
                            <div></div>
                            {/* <h3 id={styles.profileRecado} ref={recadoRef}>Olá! +insira o nome registrado+! Meus amigos me chamam de RONB1NT5CAT5CO, e carregar essa página utilizou <b>0,5 WATTS</b> da sua bateria! °-°</h3> */}
                            <div id={styles.profileNumbers}>
                                <div className={styles.numbers}>
                                    <h4>Numero</h4>
                                    <p>{userObj.peguets}</p>
                                </div>
                                <div className={styles.numbers}>
                                    <h4>Karma</h4>
                                    <p>{userObj.karma}</p>
                                </div>
                                <div className={styles.numbers}>
                                    <h4>Nota</h4>
                                    <p>{userObj.nota}</p>
                                </div>
                            </div>
                        </div>
                        <div id={styles.postagens}>
                            <div id={styles.criarPost}>
                                <button id={styles.criarPostButton} onClick={() => { setCropOpen(true); setCropType("submitPeguet") }}>Enviar postagem</button>
                            </div>

                            {!postsList && (
                                <div id={styles.noPost}>
                                    <img src="icons/sem-postagem.png"></img>
                                    <h3 id={styles.noPostText}>Sem postagens</h3>
                                </div>
                            )}

                            {postsList && postsList.map((post) => {
                                return (
                                    <div className={styles.post} key={post.id}>
                                        <img className={styles.postImg} src={post.url}></img>
                                        <div className={styles.postReactions}>
                                            <div className={styles.postButtons}>
                                                <img className={styles.buttons} src="icons/kiss-icon.png"></img>
                                                <p className={styles.peguetLevel}>0</p>
                                                <img className={styles.buttons} src="icons/puke-icon.png"></img>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div></>
                ) : (
                    <div id={styles.profileLoading} ref={loadingRef}>
                        <img id={styles.loadingImg} src='icons/profile-icon.png'></img>
                    </div>
                )}


            </div >
            {deslogado && (

                <div id={styles.logout}>
                    <h1>Deslogado</h1>
                    <br></br>
                    <p>Você não devia estar aqui... Então é melhor fazer o <a href='/login'>login</a> logo, ou eu vou te encontrar...</p>
                    <img id={styles.logoutImg} src='icons/profile-icon.png'></img>
                </div>
            )}
        </>

    )

}

