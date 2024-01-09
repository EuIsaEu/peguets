// pages/UploadImage.js
import React, { useEffect, useState } from 'react';
import ImageUploader from './componentes/UploadImage';
import Cropper from 'cropperjs';

const UploadImage = () => {
  const [croppedImageUrl, setCroppedImageUrl] = useState(null)

  useEffect(() => {

    const image = document.getElementById('img');
    const cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      viewMode: 3
    });

    document.getElementById('cortar').addEventListener('click', () => {
      const canvas = cropper.getCroppedCanvas().toDataURL();
      setCroppedImageUrl(canvas);
      console.log(canvas)
    })

  }, [])

  return (
    <div>
      <h1>Upload de Imagem</h1>
      {/* <ImageUploader /> */}
      <img id='img' src='carrossel/leticia-um.png'></img>
      <button id='cortar'>cortar</button>
      {croppedImageUrl && (
        <img src={croppedImageUrl}></img>
      )}
    </div>
  );
};

export default UploadImage;
