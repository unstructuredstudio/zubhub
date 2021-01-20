import Compressor from "compressorjs";



const Compress = (images,setImages) => {
    let compressed = [];

    for (let index = 0; index < images.length; index += 1) {
      let image = images[index];

      if (image) {
          new Compressor(image, {
            quality: 0.6,
            convertSize: 100000,
            success: (result) => {
              compressed.push(result);
              shouldSetImages(compressed, images, setImages);
            },
            error: (error) => {
              console.warn(error.message);
              compressed.push(image);
              shouldSetImages(compressed, images, setImages);
            },
          })
      }
    }
  };

  const shouldSetImages = (compressed, images, setImages) =>{
      if(compressed.length === images.length){
       setImages(compressed);
      }
  }

export default Compress