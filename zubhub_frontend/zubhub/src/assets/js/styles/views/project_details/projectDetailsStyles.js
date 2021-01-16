const styles = theme => ({
  root: {
    flex: '1 0 auto',
  },
  projectDetailHeaderStyle: {
    paddingTop: '1.5em',
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0), 0px 1px 1px 0px rgba(0,0,0,0), 0px 1px 3px 0px rgba(0,0,0,0)',
    background: 'rgba(255,204,0,1)',
    background:
      '-moz-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,204,0,1)), color-stop(25%, rgba(255,229,133,1)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    background:
      '-webkit-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-o-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      '-ms-linear-gradient(top, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    background:
      'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    filter:
      "progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffcc00', endColorstr='#ffffff', GradientType=0 )",
  },
  titleStyle: {
    fontWeight: 900,
    textAlign: 'center',
  },
  metaInfoStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorProfileStyle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
    '& a': {
      display: 'flex',
      alignItems: 'center',
    },
    [theme.breakpoints.down('500')]: {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  creatorAvatarStyle: {
    display: 'inline-block',
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    backgroundColor: '#ffffff',
    marginRight: '0.5em',
  },
  headerStyle: {
    maxWidth: '1000px',
  },
  detailStyle: {
    maxWidth: '1000px',
  },
  videoWrapperStyle: {
    backgroundColor: 'black',
    marginBottom: '1em',
    height: '100%',
    paddingBottom: '56.25%',
    [theme.breakpoints.down('1080')]: {
      height: 0,
    },
    [theme.breakpoints.down('959')]: {
      paddingBottom: '56.25%',
    },
  },
  iframeStyle: {
    position: 'absolute',
    borderStyle: 'none',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('959')]: {
      width: '100%',
      height: '100%',
    },
    zIndex: 1,
  },
  actionBoxStyle: {
    backgroundColor: '#00B8C4',
    '&:hover': {
      backgroundColor: '#03848C',
    },
    borderRadius: '15px',
    position: 'absolute',
    top: '0',
    right: '-4.5em',
    width: '3.5em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('1080')]: {
      position: 'static',
      height: '3.5em',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  },
  actionBoxButtonStyle: {
    margin: '0.5em',
    display: 'flex',
    maxWidth: '100%',
    minWidth: 0,
    flexDirection: 'column',
    '& span': { display: 'flex', flexDirection: 'column' },
    [theme.breakpoints.down('1080')]: {
      flexDirection: 'row',
      marginBottom: '1em',
      '& span': {
        flexDirection: 'row',
      },
    },
    textAlign: 'center',
    color: 'white',
    '& MuiFab-root:hover': {
      color: '#F2F2F2',
    },
    '& svg': {
      fill: 'white',
    },
    '& svg:hover': {
      fill: '#F2F2F2',
    },
  },
  sliderBoxStyle: {
    [theme.breakpoints.down('1080')]: {
      width: '90%',
    },
  },
  carouselImageStyle: {
    borderRadius: '15px',
    objectFit: 'cover',
    width: '180px',
    height: '200px',
  },
  enlargedImageDialogStyle: {
    display: 'flex',
    justifyContent: 'center',
  },
  enlargedImageStyle: {
    alignSelf: 'center',
    width: '80%',
    maxWidth: '600px',
    height: 'auto',
  },
  descriptionHeadingStyle: {
    marginTop: '1em',
    fontWeight: 900,
    fontSize: '2.2rem',
  },
  descriptionBodyStyle: {
    fontSize: '1.5rem',
    marginBottom: '0.7em',
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
  commentSectionStyle: {
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2.5em',
    marginBottom: '2.5em',
    borderRadius: '15px',
    backgroundColor: '#E4E4E4',
  },
  commentAvatarStyle: {
    backgroundColor: '#c4c4c4',
    marginRight: '1em',
  },
  commentsStyle: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
    backgroundColor: 'white',
    maxWidth: '1000px',
    width: '100%',
    fontSize: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 1px 4px rgba(0,0,0,.06)',
    border: '1px solid rgba(0,0,0,.1)',
    margin: '0.8em',
  },
  commentMetaStyle: {
    display: 'flex',
    marginBottom: '1em',
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

  materialsUsedViewStyle: {
    padding: '0.5em',
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
  positionRelative: { position: 'relative' },
  positionAbsolute: { position: 'absolute' },
  marginBottom1em: { marginBottom: '1em' },
  errorBox: {
    width: '100%',
    padding: '1em',
    borderRadius: 6,
    borderWidth: '1px',
    borderColor: '#a94442',
    backgroundColor: '#ffcdd2',
  },
  error: {
    color: '#a94442',
  },
});

export const sliderSettings = images_num => ({
  className: 'center slider',
  centerMode: true,
  infinite: true,
  centerPadding: '60px',
  dots: false,
  autoplay: true,
  speed: 500,
  slidesToShow: 4 > images_num ? images_num : 4,
  slidesToScroll: 1,
  focusOnSelect: true,
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
        slidesToShow: 2 > images_num ? images_num : 2,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 550,
      settings: {
        slidesToShow: 1 > images_num ? images_num : 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
  ],
});

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        height: '200px',
        width: '30px',
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

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        height: '200px',
        width: '30px',
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
