const styles = theme => ({
  root: {
    flex: '1 0 auto',
  },
  activityDetailContainer: {
    width: '100%',
    margin: 'auto',
  },
  activityDetailBlockContainer: {
    width: '80%',
    margin: '3em auto',
    [theme.breakpoints.down('700')]: {
      width: '90%',
    },
  },
  activityDetailBlock: {
    width: '60%',
    margin: '3em auto',
    padding: '5vh 0',
    [theme.breakpoints.down('700')]: {
      width: '90%',
    },
  },
  demoImageContainerStyle: {
    height: '450px',
  },
  leftCropedContainer: {
    clipPath: 'polygon(100% 10%,100% 100%, 0% 100%,0% 0%)',
    padding: '8em 20%',
    minHeight: '80vh',
    backgroundColor: '#FFCE0C',
    [theme.breakpoints.down('511')]: {
      padding: '1em 5%',
      clipPath: 'polygon(100% 5%,100% 100%, 0% 100%,0% 0%)',
    },
  },
  inspiringExamplesContainer: {
    clipPath: 'polygon(100% 0%,100% 100%, 0% 100%,0% 10%)',
    padding: '8em 20% ',
    minHeight: '80vh',
    backgroundColor: '#FFCE0C',
    [theme.breakpoints.down('511')]: {
      padding: '1em 5%',
      clipPath: 'polygon(100% 0%,100% 100%, 0% 100%,0% 5%)',
    },
  },
  inspiringExampleImageStyle: {
    height: '100%',
    objectFit: 'cover',
    margin: '2%',
  },
  demoImageStyle: {
    objectFit: 'cover',
    height: '60vh',
    // width: '100%',
    maxWidth: '100%',
    borderRadius: '15px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  titleStyle: {
    fontWeight: 800,
    // fontFamily: 'Inknut Antiqua',
    color: '#3E3E5F',
  },
  artistBiography: {
    alignSelf: 'center',
  },
  createdOn: {
    // fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: '1.1rem',
    // fontWeight: 700,
    color: '#3E3E5F',
  },
  videoPlayer: {
    borderRadius: '15px',
    height: '60vh',
  },
  imageCreditStyle: {
    color: 'white',
    fontSize: '10px',
    textAlign: 'center',
  },

  subTitles: {
    // fontFamily: 'Corben',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '2rem',
    [theme.breakpoints.down('700')]: {
      fontWeight: 700,
      fontSize: '1.8rem',
    },

    textAlign: 'center',
    margin: '3em 0 1em 0',
    color: '#3E3E5F',
  },

  makingStepsDescriptionStyle: {
    marginBottom: '0.7em',
    color: 'rgba(0, 0, 0, 0.54)',
    '& .ql-editor': {
      fontSize: '1rem',
      fontFamily: 'Raleway,Roboto,sans-serif',
    },
  },
  creatorImage: {
    objectFit: 'cover',
    height: 'auto',
    width: '80%',
    borderRadius: '50%',
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    '&:hover': {
      width: '80%',
      height: 'auto',
      border: '2px solid rgba(0, 0, 0, .12)',
    },
  },
  quillBodyStyle: {
    color: '#3E3E5F',
    '& .ql-editor': {
      fontSize: '1.2rem',
      fontFamily: 'Raleway,Roboto,sans-serif',
      fontWeight: 500,
    },
    [theme.breakpoints.down('959')]: {
      '& .ql-editor': {
        fontSize: '1rem',
      },
    },
  },
  quillTextCenter: {
    '& p': {
      textAlign: 'center',
    },
  },
  motivationBodyStyle: {
    marginBottom: '0.7em',
    color: 'rgba(0, 0, 0, 0.54)',
    '& .ql-editor': {
      fontSize: '1.5rem',

      fontFamily: 'Raleway,Roboto,sans-serif',
    },
    '& p': {
      textAlign: 'center',
    },
  },

  videoWrapperStyle: {
    marginBottom: '1em',
    position: 'relative',
    paddingBottom: '40.25%',
    maxWidth: '1000px',
    [theme.breakpoints.down('959')]: {
      paddingBottom: '56.25%',
    },
  },
  iframeStyle: {
    position: 'absolute',
    borderRadius: '15px',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },

  materialsUsedStyle: {
    display: 'inline-block',
    fontSize: '1.5rem',
    padding: '0.2em 0.5em',
    color: '#00B8C4',
    borderRadius: '15px',
    border: '1px solid #00B8C4',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  },
  tagsBoxStyle: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tagsStyle: {
    backgroundColor: '#E4E4E4',
    textTransform: 'lowercase',
    color: 'black',
    border: 'none',
    padding: '0 0.6em',
    fontSize: '1.2rem',
    borderRadius: '15px',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  },
  categoryStyle: {
    fontSize: '1.5rem',
    color: 'rgba(0, 0, 0, 0.54)',
    textTransform: 'lowercase',
    borderRadius: '50px',
    padding: '0 0.6em',
    marginBottom: '0.7em',
  },

  customLabelStyle: {
    '&.MuiFormLabel-root.Mui-focused': {
      color: '#00B8C4',
    },
  },
  secondaryLink: {
    color: '#00B8C4',
    '&:hover': {
      color: '#03848C',
    },
  },

  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDecorationNone: {
    textDecoration: 'none',
  },
  floatRight: { float: 'right' },
  displayNone: { display: 'none' },
  largeLabel: {
    fontSize: '1.3rem',
  },
  dialogButtonContainer: {
    padding: '16px 24px',
  },
});

// export const sliderSettings = images_num => ({
//   className: 'center slider detail-page-slider',
//   centerMode: true,
//   infinite: true,
//   centerPadding: '60px',
//   dots: false,
//   autoplay: true,
//   speed: 500,
//   slidesToShow: 4 > images_num ? images_num : 4,
//   slidesToScroll: 1,
//   focusOnSelect: true,
//   swipeToSlide: true,
//   nextArrow: <NextArrow />,
//   prevArrow: <PrevArrow />,
//   responsive: [
//     {
//       breakpoint: 980,
//       settings: {
//         slidesToShow: 3 > images_num ? images_num : 3,
//         slidesToScroll: 1,
//         infinite: true,
//       },
//     },
//     {
//       breakpoint: 770,
//       settings: {
//         slidesToShow: 2 > images_num ? images_num : 2,
//         slidesToScroll: 1,
//         infinite: true,
//       },
//     },
//     {
//       breakpoint: 550,
//       settings: {
//         slidesToShow: 1 > images_num ? images_num : 1,
//         slidesToScroll: 1,
//         infinite: true,
//       },
//     },
//   ],
// });

// export function NextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: 'flex',
//         height: '200px',
//         width: '30px',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: '0 15px 15px 0',
//         background: '#767474',
//         zIndex: '10',
//         boxShadow:
//           '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
//         backgroundColor: '#00B8C4',
//         '&:hover': {
//           backgroundColor: '#03848C',
//         },
//       }}
//       onClick={onClick}
//     />
//   );
// }

// export function PrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: 'flex',
//         height: '200px',
//         width: '30px',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: '15px 0 0 15px',
//         background: '#767474',
//         zIndex: '10',
//         boxShadow:
//           '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
//         backgroundColor: '#00B8C4',
//         '&:hover': {
//           backgroundColor: '#03848C',
//         },
//       }}
//       onClick={onClick}
//     />
//   );
// }

export default styles;
