const styles = theme => ({
  sliderVideo :{
    width: '100%',
    opacity: '0.5',
    borderRadius: '15px',
    border: '3px solid #FFCE0C',
    float: 'none',
    position:'relative',
  },
  sliderBox:{
    width: '80%',
    margin: 'auto',
  },
  activeSlideContainer:{
    width: '100%',
    position: 'relative',
    height: '30vh',
    paddingTop: '75%'
  },
  activeCarouselVideo:{
    position: 'absolute',
    top: '0',
    width: '100%',
    height: '70%!important',
    borderRadius: '15px',
    border: '7px solid #FFCE0C',
  },
  bannerContainer:{
    width: '100%',
    height: '35vh',
    backgroundColor: '#DC3545',
  },
  slideContainer:{
    width: '100%',
    display: 'flex!important',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slickList: {
   // padding: '0 !important'
  },
  slickNext: {
    top: '10vh !important',
  }
})

export const sliderSettings = (images_num, func) => ({
  className: 'center slider detail-page-slider',
  centerMode: true,
  infinite: true,
//   centerPadding: '60px',
  dots: false,
  autoplay: false,
  //speed: 1000,
  slidesToShow: 3 > images_num ? images_num : 3,
  slidesToScroll: 1,
  focusOnSelect: true,
  afterChange : func,
  swipeToSlide: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 3 > images_num ? images_num : 3,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 770,
      settings: {
        slidesToShow: 1 > images_num ? images_num : 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
  ],
});

export function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        height: '150px',
        width: '25px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '0 15px 15px 0',
        background: '#767474',
        zIndex: '10',
        boxShadow:
          '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        backgroundColor: '#00B8C4',
        '&:hover': {
          backgroundColor: '#03848C',
        },
      }}
      onClick={onClick}
    />
  );
}

export function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        height: '150px',
        width: '25px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '15px 0 0 15px',
        background: '#767474',
        zIndex: '10',
        boxShadow:
          '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        backgroundColor: '#00B8C4',
        '&:hover': {
          backgroundColor: '#03848C',
        },
      }}
      onClick={onClick}
    />
  );
}

export default styles;