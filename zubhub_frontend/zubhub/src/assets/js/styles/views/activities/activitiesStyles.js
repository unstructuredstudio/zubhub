const styles = theme => ({
  tabs: {
    margin: '2em 0',
    [theme.breakpoints.up('900')]: {
      paddingRight: '1em',
    },
  },
  tab: {
    textTransform: 'none',
    fontSize: '1.2em',
    fontWeight: 600,
  },
  activityListContainer: {
    marginTop: '2em',
    [theme.breakpoints.down('378')]: {
      marginTop: '3em',
    },
  },
  activitiesContainer: {
    marginTop: 0,
  },
  activityBoxContainer: {
    padding: '5vh 10px',
    position: 'relative',
  },
  sliderVideo: {
    width: '100%',
    opacity: '0.5',
    borderRadius: '15px',
    border: '3px solid var(--primary-color2)',
    float: 'none',
    position: 'relative',
  },
  sliderBox: {
    width: '80%',
    margin: 'auto',
  },
  activeSlideContainer: {
    width: '100%',
    position: 'relative',
    height: '30vh',
    paddingTop: '75%',
  },
  activeCarouselVideo: {
    position: 'absolute',
    top: '0',
    width: '100%',
    // height: '70%!important',
    borderRadius: '15px',
    border: '7px solid var(--primary-color2)',
  },
  bannerContainer: {
    width: '100%',
    height: '35vh',
    backgroundColor: 'var(--primary-color1)',
  },
  slideContainer: {
    width: '100%',
    display: 'flex!important',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// export const sliderSettings = (images_num, func) => ({
//   className: 'center slider detail-page-slider',
//   centerMode: true,
//   infinite: true,
//   //   centerPadding: '60px',
//   dots: false,
//   autoplay: false,
//   //speed: 1000,
//   slidesToShow: 3 > images_num ? images_num : 3,
//   slidesToScroll: 1,
//   focusOnSelect: true,
//   afterChange: func,
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
//         height: '150px',
//         width: '25px',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: '0 15px 15px 0',
//         background: 'var(--text-color2)',
//         zIndex: '10',
//         boxShadow:
//           '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
//         backgroundColor: 'var(--primary-color3)',
//         '&:hover': {
//           backgroundColor: 'var(--secondary-color6)',
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
//         height: '150px',
//         width: '25px',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: '15px 0 0 15px',
//         background: 'var(--text-color2)',
//         zIndex: '10',
//         boxShadow:
//           '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
//         backgroundColor: 'var(--primary-color3)',
//         '&:hover': {
//           backgroundColor: 'var(--secondary-color6)',
//         },
//       }}
//       onClick={onClick}
//     />
//   );
// }

export default styles;
