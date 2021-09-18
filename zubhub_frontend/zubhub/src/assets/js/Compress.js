// import Compressor from 'compressorjs';

// const Compress = (images, state, handleSetState) => {
//   let compressed = [];

//   for (let index = 0; index < images.length; index += 1) {
//     let image = images[index];

//     if (image && image.type.split('/')[1] !== 'gif') {
//       new Compressor(image, {
//         quality: 0.6,
//         convertSize: 100000,
//         success: result => {
//           compressed.push(result);
//           shouldSetImages(compressed, images, state, handleSetState);
//         },
//         error: error => {
//           console.warn(error.message);
//           compressed.push(image);
//           shouldSetImages(compressed, images, state, handleSetState);
//         },
//       });
//     } else {
//       compressed.push(image);
//       shouldSetImages(compressed, images, state, handleSetState);
//     }
//   }
// };

// const shouldSetImages = (compressed, images, state, handleSetState) => {
//   if (compressed.length === images.length) {
//     const { media_upload } = state;
//     media_upload.images_to_upload = compressed;

//     handleSetState(media_upload);
//   }
// };

// export default Compress;
