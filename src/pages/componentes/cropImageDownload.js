// import { useState, useRef } from 'react'
// import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from "react-image-crop";

// import { canvasPreview } from "../api/canvasPreview";
// import { useDebounceEffect } from "../api/useDebounceEffect";

// import "react-image-crop/dist/ReactCrop.css";

// import styles from '../../styles/components.module.css';

// function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
//     return centerCrop(
//         makeAspectCrop(
//             {
//                 unit: "%",
//                 width: 90,
//             },
//             aspect,
//             mediaWidth,
//             mediaHeight,
//         ),
//         mediaWidth,
//         mediaHeight,
//     );
// }

// export default function CropImage({ closeCrop }) {

//     const [img, setImg] = useState("");
//     const [crop, setCrop] = useState("");
//     const [aspect, setAspect] = useState(1 / 1);
//     const [completedCrop, setCompletedCrop] = useState("");
//     const [scale, setScale] = useState(1);
//     const [rotate, setRotate] = useState(0);

//     const divRef = useRef(null);
//     const previewCanvasRef = useRef(null);
//     const hiddenAnchorRef = useRef(null);
//     const imgRef = useRef(null);
//     const blobUrlRef = useRef("");

//     const selecionarImagem = (e) => {
//         const file = e.target.files?.[0]
//         if (!file) return;
//         setCrop(undefined);
//         const reader = new FileReader();
//         reader.addEventListener("load", () => {
//             const imageUrl = reader.result?.toString() || "";
//             setImg(imageUrl)
//             console.log(imageUrl)
//         });
//         reader.readAsDataURL(file)
//     };

//     const onLoadImg = (e) => {
//         if (aspect) {
//             const { width, height } = e.currentTarget;
//             setCrop(centerAspectCrop(width, height, aspect));
//         }
//     }

//     async function onDownloadCropClick() {
//         const image = imgRef.current;
//         const previewCanvas = previewCanvasRef.current;
//         if (!image || !previewCanvas || !completedCrop) {
//             throw new Error("Crop canvas does not exist");
//         }

//         // This will size relative to the uploaded image
//         // size. If you want to size according to what they
//         // are looking at on screen, remove scaleX + scaleY
//         const scaleX = image.naturalWidth / image.width;
//         const scaleY = image.naturalHeight / image.height;

//         const offscreen = new OffscreenCanvas(
//             completedCrop.width * scaleX,
//             completedCrop.height * scaleY,
//         );
//         const ctx = offscreen.getContext("2d");
//         if (!ctx) {
//             throw new Error("No 2d context");
//         }

//         ctx.drawImage(
//             previewCanvas,
//             0,
//             0,
//             previewCanvas.width,
//             previewCanvas.height,
//             0,
//             0,
//             offscreen.width,
//             offscreen.height,
//         );
//         // You might want { type: "image/jpeg", quality: <0 to 1> } to
//         // reduce image size
//         const blob = await offscreen.convertToBlob({
//             type: "image/png",
//         });

//         if (blobUrlRef.current) {
//             URL.revokeObjectURL(blobUrlRef.current);
//         }
//         blobUrlRef.current = URL.createObjectURL(blob);
//         hiddenAnchorRef.current.href = blobUrlRef.current;
//         hiddenAnchorRef.current.click();
//     };

//     const mudarRotate = (e) => {
//         const newRotate = e.target.value;
//         setRotate(newRotate)
//     }

//     const mudarScale = (e) => {
//         const newScale = e.target.value;
//         setScale(newScale)
//     }

//     const fecharCropper = () => {
//         divRef.current.style.opacity = "0";
//         setTimeout(() => {
//             closeCrop()
//         }, 1200);
//     }

//     useDebounceEffect(
//         async () => {
//             if (
//                 completedCrop?.width &&
//                 completedCrop?.height &&
//                 imgRef.current &&
//                 previewCanvasRef.current
//             ) {
//                 // We use canvasPreview as it's much faster than imgPreview.
//                 canvasPreview(
//                     imgRef.current,
//                     previewCanvasRef.current,
//                     completedCrop,
//                     scale,
//                     rotate,
//                 );
//             }
//         },
//         100,
//         [completedCrop, scale, rotate],
//     );

//     useEffect(() => { 
//         return () => clearTimeout(1200)
//     })


//     return (
//         <div id={styles.cropDiv} ref={divRef}>
//             <div id={styles.selImgPanel}>
//                 <label id={styles.labelSelImg} for={styles.buttonSelImg}>Escolher foto</label>
//                 <input id={styles.buttonSelImg} type="file" accept="image/*" onChange={selecionarImagem} />
//                 <img src='/icons/exit-icon.png' id={styles.exitIcon} onClick={fecharCropper}></img>
//             </div>
//             {!!img && (
//                 <ReactCrop
//                     crop={crop}
//                     onChange={(_, percentCrop) => setCrop(percentCrop)}
//                     onComplete={(c) => setCompletedCrop(c)}
//                     aspect={aspect}
//                     // minWidth={400}
//                     minHeight={100}
//                 // circularCrop
//                 >
//                     <img
//                         ref={imgRef}
//                         alt="Crop me"
//                         src={img}
//                         style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
//                         onLoad={onLoadImg}
//                     />
//                 </ReactCrop>
//             )}{!!completedCrop && (
//                 <div id={styles.canvasDiv}>
//                     <h3>Pré visualização</h3>
//                     <div id={styles.canvasPanel}>
//                         <div id={styles.rangeSide}>
//                             <img src='/icons/rotate-icon.png'></img>
//                             <input type="range" min="0" max="360" step="1" onChange={mudarRotate} orient="vertical"></input>
//                         </div>
//                         <canvas
//                             ref={previewCanvasRef}
//                             style={{
//                                 border: "1px solid black",
//                                 objectFit: "contain",
//                                 width: "50vw",
//                                 height: "50vw",
//                             }}
//                         />
//                         <div id={styles.rangeSide}>
//                             <img src='/icons/zoom-icon.png'></img>
//                             <input type="range" min="1" max="10" step="1" onChange={mudarScale} orient="vertical"></input>
//                         </div>

//                     </div>
//                     <div>
//                         <button id={styles.downloadButton} onClick={onDownloadCropClick}>Baixar imagem cortada</button>
//                         <a
//                             href="#hidden"
//                             ref={hiddenAnchorRef}
//                             download
//                             style={{
//                                 position: "absolute",
//                                 top: "-200vh",
//                                 visibility: "hidden",
//                             }}
//                         >
//                             Hidden download
//                         </a>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }