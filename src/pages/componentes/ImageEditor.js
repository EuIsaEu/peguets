import { useState, useEffect, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageEditor = ({ src, onCropComplete }) => {
    // const [cropper, setCropper] = useState();
    const [aspectRatio, setAspectRatio] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const cropperRef = useRef(null);
    const croppedImgRef = useRef(null)

    useEffect(() => {
        // Obtenha as dimensões da imagem após ela ser carregada
        const img = new Image();
        img.src = src;

        // img.onload = () => {
        //     // Calcule a proporção de aspecto da imagem
        //     const imageAspectRatio = img.width / img.height;
        //     setAspectRatio(imageAspectRatio);
        // };

        const handleCropComplete = () => {
            const croppedImgRef = cropperRef.current.getCroppedCanvas().toDataURL('image/png');
            console.log(cropperRef)

            // if (cropperRef) {
            //     // const setCroppedImageUrl = cropperRef.current.getCroppedCanvas().toDataURL('image/png');
            //     // setCroppedImageUrl(croppedImageUrl);
            //     // onCropComplete(croppedImageUrl);
            // }
        };


    }, [src]);

    return (
        <div>
            <Cropper
                src={src}
                style={{ height: 'auto', width: '60%' }}
                aspectRatio={1 / 1}
                guides={true}
                ref={cropperRef}
            />
            {croppedImgRef && (
                <div>
                    <h2>Imagem Cortada</h2>
                    <img src={croppedImgRef} alt="Imagem Cortada" />
                </div>
            )}

        </div>
    );
};

export default ImageEditor;
