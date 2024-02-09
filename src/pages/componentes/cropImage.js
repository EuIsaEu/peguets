import { useState, useRef, useEffect, useId } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from "react-image-crop";

import { canvasPreview } from "../api/canvasPreview";
import { useDebounceEffect } from "../api/useDebounceEffect";

import "react-image-crop/dist/ReactCrop.css";
import styles from '../../styles/components.module.css';

import { storage } from "../api/firebase"
import { database } from '../api/firebase';
import { ref, uploadBytes, getMetadata, getDownloadURL } from "firebase/storage"
import { get, ref as dataRef, serverTimestamp, set } from "firebase/database"

import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(makeAspectCrop({ unit: "%", width: 90, }, aspect, mediaWidth, mediaHeight,), mediaWidth, mediaHeight,);
}

export default function CropImage({ closeCrop, cropType, loadNewData, loadNewPeguet }) {

    const [img, setImg] = useState("");
    const [crop, setCrop] = useState("");
    const [aspect, setAspect] = useState(1 / 1);
    const [completedCrop, setCompletedCrop] = useState("");
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [loadingImg, setLoadingImg] = useState("")

    const divRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const hiddenAnchorRef = useRef(null);
    const imgRef = useRef(null);
    const blobUrlRef = useRef("");
    const cropImageRef = useRef(null)
    const loadingBgRef = useRef(null)

    //===================================================================
    //=========== FUNÇÕES ===============================================
    //===================================================================

    const selecionarImagem = (e) => {
        const file = e.target.files?.[0]
        if (!file) return;
        setCrop(undefined);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageUrl = reader.result?.toString() || "";
            setImg(imageUrl)
        });
        reader.readAsDataURL(file)
    };

    const onLoadImg = (e) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    }

    const mudarRotate = (e) => {
        const newRotate = e.target.value;
        setRotate(newRotate)
    }

    const mudarScale = (e) => {
        const newScale = e.target.value;
        setScale(newScale)
    }

    const fecharCropper = () => {
        if (cropImageRef.current) {
            cropImageRef.current.style.opacity = "0"
            setTimeout(() => {
                loadingBgRef.current.style.display = "none"
                closeCrop()
            }, 100);
        }
    }

    //===================================================================
    //=========== FUNÇÕES DE ENVIO DAS FOTOS ============================
    //===================================================================

    const submitProfilePic = async (blob) => {
        try {
            setLoadingImg(true);

            const user = JSON.parse(localStorage.getItem("user-credentials"))
            const userId = user.uid

            const storageRef = ref(storage, "peguets/usersProfilePics/" + userId + ".webp");
            const userRef = dataRef(database, "peguets/UsersAuthList/" + userId)
            console.log(storageRef)

            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a new pfp!');
                getDownloadURL(snapshot.ref).then((url) => {
                    get(userRef).then((snapshot) => {
                        if (snapshot.exists()) {
                            var data = snapshot.val();
                            data.profilePicURL = url;
                            set(userRef, data);
                            loadNewData(data);
                        }
                    })
                    var userInfo = JSON.parse(localStorage.getItem("user-info"))
                    userInfo.profilePicURL = url;
                    localStorage.setItem("user-info", JSON.stringify(userInfo))
                })
                fecharCropper();
            });
        } catch (error) {
            console.error("erro ao enviar imagem: ", error);
        } finally {
            setLoadingImg(false);
        }
    }

    const submitPeguet = async (blob) => {
        try {
            setLoadingImg(true);

            const user = JSON.parse(localStorage.getItem("user-credentials"))
            var userInfo = JSON.parse(localStorage.getItem("user-info"))
            const userId = user.uid

            let randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals, adjectives] });

            const storageRef = ref(storage, "peguets/posts/" + randomName + ".webp");

            const userRef = dataRef(database, "peguets/UsersAuthList/" + userId);
            const postagemRef = dataRef(database, "peguets/postagens/" + randomName);
            const userPostRef = dataRef(database, "peguets/UsersAuthList/" + userId + "/postagens/" + randomName);

            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a new peguet!');
                getDownloadURL(snapshot.ref).then((url) => {

                    get(userRef).then((snapshot) => {

                        var data = snapshot.val()
                        data.peguets += 1;

                        set(userRef, data).then(() => {
                            console.log("usuario atualizado com sucesso")

                            get(userPostRef).then((snapshot) => {
                                if (!snapshot.exists()) {
                                    const postagem = {
                                        id: randomName,
                                        time: serverTimestamp(),
                                        url: url,
                                        userId: userId,
                                        userNome: userInfo.nome,
                                    }
                                    set(userPostRef, postagem)
                                    set(postagemRef, postagem)
                                    loadNewPeguet(postagem)
                                } else {
                                    submitPeguet();
                                }
                            })

                        }).catch((error) => {
                            console.error("erro ao atualizar usuario ", error)
                        })
                    })

                })
                fecharCropper();
            });

        } catch (error) {
            console.error("erro ao enviar imagem: ", error);
        } finally {
            setLoadingImg(false);
        }
    }


    async function onSendCropClick() {

        loadingBgRef.current.style.display = "flex";

        const image = imgRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error("Crop canvas does not exist");
        }

        // This will size relative to the uploaded image
        // size. If you want to size according to what they
        // are looking at on screen, remove scaleX + scaleY
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY,);
        const ctx = offscreen.getContext("2d");
        if (!ctx) {
            throw new Error("No 2d context");
        }

        ctx.drawImage(previewCanvas, 0, 0, previewCanvas.width, previewCanvas.height, 0, 0, offscreen.width, offscreen.height,);
        // You might want { type: "image/jpeg", quality: <0 to 1> } to
        // reduce image size
        const blob = await offscreen.convertToBlob({
            type: "image/webp",
        });

        switch (cropType) {
            case "submitProfilePic":
                submitProfilePic(blob);
                break;
            case "submitPeguet":
                submitPeguet(blob);
                break;
            default:
                break;
        }

        // do {
        //     let randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals, adjectives] });
        //     console.log(randomName)

        //     const storageRef = ref(storage, "peguets/" + randomName + ".webp");

        //     try {
        //         //verificando se existe um arquivo com o mesmo nome
        //         await getMetadata(storageRef);
        //         alert("Documento já existe, tente novamente");

        //     } catch (error) {
        //         if (error.code === "storage/object-not-found") {
        //             uploadBytes(storageRef, blob).then((snapshot) => {
        //                 console.log('Uploaded a blob or file!');
        //                 fecharCropper();
        //                 setLoadingImg(false);
        //             });
        //         }
        //     }
        // } while (loadingImg)

        // if (blobUrlRef.current) {
        //     URL.revokeObjectURL(blobUrlRef.current);
        // }
        // blobUrlRef.current = URL.createObjectURL(blob);
        // hiddenAnchorRef.current.href = blobUrlRef.current;
        // hiddenAnchorRef.current.click();
    };

    useDebounceEffect(
        async () => {
            if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate,);
            }
        }, 100, [completedCrop, scale, rotate],
    );

    useEffect(() => {

        // document.body.style.overflow = 'hidden';

        return () => {
            // document.body.style.overflow = '';
            clearTimeout(100)
        }
    })


    return (
        <div id={styles.cropImage} ref={cropImageRef}>
            <div id={styles.bgBlack}></div>
            <div id={styles.cropDiv} ref={divRef}>
                <div id={styles.loadingBg} ref={loadingBgRef}>
                    <p>Enviando imagem...</p>
                    <div id={styles.loadingBgCanvas}></div>
                </div>
                <div id={styles.selImgPanel}>
                    <label id={styles.labelSelImg} htmlFor={styles.buttonSelImg}>Escolher foto</label>
                    <input id={styles.buttonSelImg} type="file" accept="image/*" onChange={selecionarImagem} />
                    <img src='/icons/exit-icon.png' id={styles.exitIcon} onClick={fecharCropper}></img>
                </div>
                {!!img && (
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        // minWidth={400}
                        minHeight={100}
                    // circularCrop
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={img}
                            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                            onLoad={onLoadImg}
                        />
                    </ReactCrop>
                )}{!!completedCrop && (
                    <div id={styles.canvasDiv}>
                        <h3>Pré visualização</h3>
                        <div id={styles.canvasPanel}>
                            <div id={styles.rangeSide}>
                                <img src='/icons/rotate-icon.png'></img>
                                <input type="range" min="0" max="360" step="1" onChange={mudarRotate} orient="vertical"></input>
                            </div>
                            <canvas
                                ref={previewCanvasRef}
                                style={{
                                    border: "1px solid black",
                                    objectFit: "contain",
                                    width: "70%",
                                    height: "80%",
                                }}
                            />
                            <div id={styles.rangeSide}>
                                <img src='/icons/zoom-icon.png'></img>
                                <input type="range" min="1" max="10" step="0.1" onChange={mudarScale} orient="vertical"></input>
                            </div>

                        </div>
                        <div>
                            <button id={styles.downloadButton} onClick={onSendCropClick}>Enviar imagem</button>
                            <a
                                href="#hidden"
                                ref={hiddenAnchorRef}
                                download
                                style={{
                                    position: "absolute",
                                    top: "-200vh",
                                    visibility: "hidden",
                                }}
                            >
                                Hidden download
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}