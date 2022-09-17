//   const { t } = useTranslation();
//   const { t } = useTranslation();
//   const generatePdf = () => {
//     const input = document.getElementById(componentKeys);
//     setTimeout(function () {
//       console.log('from generate pdf', input);
//       html2canvas(input).then(canvas => {
//         const img = canvas.toDataURL('image/jpeg', 1);
//         const pdf = new jsPDF('p', 'px', 'a4');
//         let pageWidth = pdf.internal.pageSize.getWidth();
//         let pageHeight = pdf.internal.pageSize.getHeight();
//         let imageWidth = canvas.width;
//         let imageHeight = canvas.height;

//         let ratio =
//           imageWidth / imageHeight >= pageWidth / pageHeight
//             ? pageWidth / imageWidth
//             : pageHeight / imageHeight;
//         //pdf = new jsPDF(this.state.orientation, undefined, format);
//         pdf.addImage(
//           img,
//           'JPEG',
//           0,
//           0,
//           imageWidth * ratio,
//           imageHeight * ratio,
//         );
//         //   doc.addImage(img, 'PNG', 10, 10, '100%', 'auto');
//         console.log('from generate pdf canvas', img);
//         pdf.save('newActivity.pdf');
//       });
//     }, 500);
//   };
//   var specialElementHandlers = {
//     '#activityVideo': function (element, renderer) {
//       return true;
//     },
//   };
//   const generatePdf2 = () => {
//     window.html2canvas = html2canvas;
//     const doc = new jsPDF('p', 'px', 'a4');
//     doc
//       .html(document.getElementById(componentKeys), { x: 10, y: 10, w: 400 })
//       .then(() => doc.save('saveInCallback.pdf'));
//   };

//   const generatePdf1 = () => {
//     const doc = new jsPDF('p', 'px', 'a4');

//     let height = 10;
//     componentKeys.forEach((element, index) => {
//       let input = document.getElementById(element);
//       console.log('input ==> height', input.nodeName, input.offsetHeight);
//       if (input.nodeName === 'IMG') {
//         // const img = canvas.toDataURL('image/jpeg', 1);
//         let pageWidth = doc.internal.pageSize.getWidth() / 3;
//         let pageHeight = doc.internal.pageSize.getHeight() / 3;
//         let imageWidth = input.offsetWidth;
//         let imageHeight = input.offsetHeight;

//         let ratio =
//           imageWidth / imageHeight >= pageWidth / pageHeight
//             ? pageWidth / imageWidth
//             : pageHeight / imageHeight;
//         console.log('image heigth', input, height);
//         doc.addImage(
//           input,
//           'JPEG',
//           10,
//           height,
//           imageWidth * ratio,
//           imageHeight * ratio,
//         );
//       } else if (input.nodeName !== 'BUTTON') {
//         console.log('text heigth', input, height);
//       //  10, height, 
//         doc.text(input.innerText);
//       }
//       if (
//         document.getElementById(componentKeys[index]).nodeName !== 'DIV' &&
//         document.getElementById(componentKeys[index]).nodeName !== 'BUTTON'
//       ) {
//         height += document.getElementById(componentKeys[index]).offsetHeight;
//       }
//     });
//     doc.save();
//   };
//   const generatePdfFromActivity = () => {
//     const doc = new jsPDF('p', 'px', 'a4');
//     let height = 10;
//     Object.entries(componentKeys).forEach(([key, value]) => {});
//     if (componentKeys['title']) {
//     }
//     //   console.log('input ==> height', input.nodeName, input.offsetHeight);
//     //   if (input.nodeName === 'IMG') {
//     //     // const img = canvas.toDataURL('image/jpeg', 1);
//     //     let pageWidth = doc.internal.pageSize.getWidth() / 3;
//     //     let pageHeight = doc.internal.pageSize.getHeight() / 3;
//     //     let imageWidth = input.offsetWidth;
//     //     let imageHeight = input.offsetHeight;

//     //     let ratio =
//     //       imageWidth / imageHeight >= pageWidth / pageHeight
//     //         ? pageWidth / imageWidth
//     //         : pageHeight / imageHeight;
//     //     console.log('image heigth', input, height);
//     //     doc.addImage(
//     //       input,
//     //       'JPEG',
//     //       10,
//     //       height,
//     //       imageWidth * ratio,
//     //       imageHeight * ratio,
//     //     );
//     //   } else if (input.nodeName !== 'BUTTON') {
//     //     console.log('text heigth', input, height);
//     //     doc.text(10, height, input.innerText);
//     //   }
//     //   if (
//     //     document.getElementById(componentKeys[index]).nodeName !== 'DIV' &&
//     //     document.getElementById(componentKeys[index]).nodeName !== 'BUTTON'
//     //   ) {
//     //     height += document.getElementById(componentKeys[index]).offsetHeight;
//     //   }
//     // });
//     doc.save();
//   };