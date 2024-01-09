// components/ImageUploader.js
import React, { useState } from 'react';
import ImageEditor from './ImageEditor';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageData) => {
    // Faça algo com a imagem cortada, por exemplo, exibi-la ou enviar para o Firebase Storage.
    console.log('Imagem cortada:', croppedImageData);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedImage && (
        <div>
          <ImageEditor src={selectedImage} onCropComplete={handleCropComplete} />
          <button id='CORTAR' onClick={handleCropComplete}>CORTAR</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
