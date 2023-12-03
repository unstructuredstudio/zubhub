import { colors } from "../../../colors";
import zIndex from "@material-ui/core/styles/zIndex";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const styles = theme => ({
  root: {
    flex: '1 0 auto',
  },
  box: {
    marginTop: 100,
    [theme.breakpoints.down('md')]: {
      margin: '100px 1.5rem 0 1.5rem'
    }
  },
  dialogTitle: {
    fontSize: '18px !important',
    lineHeight: '26px !important',
    marginTop: 0
  },
  projectDetailHeaderStyle: {
    paddingTop: '1.5em',
    background: 'transparent',
    // boxShadow:
    //   '0px 2px 1px -1px rgba(0,0,0,0), 0px 1px 1px 0px rgba(0,0,0,0), 0px 1px 3px 0px rgba(0,0,0,0)',
    // background: 'var(--primary-color2)',
    // background:
    //   '-moz-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-webkit-gradient(left top, left bottom, color-stop(0%, var(--primary-color2)), color-stop(25%, var(--primary-color2)), color-stop(61%, rgba(255,255,255,1)), color-stop(100%, rgba(255,255,255,1)))',
    // background:
    //   '-webkit-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-o-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   '-ms-linear-gradient(top, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // background:
    //   'linear-gradient(to bottom, var(--primary-color2) 0%, var(--primary-color2) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
    // filter:
    //   "progid:DXImageTransform.Microsoft.gradient( startColorstr='var(--primary-color2)', endColorstr='#ffffff', GradientType=0 )",
    [theme.breakpoints.down('511')]: {
      // paddingTop: '4em',
    },
  },
  titleStyle: {
    fontWeight: 800,
    textAlign: 'center',
  },
  metaInfoStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorProfileStyle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
    '& a': {
      display: 'flex',
      alignItems: 'center',
    },
    [theme.breakpoints.down('500')]: {
      width: '100%',
      // justifyContent: 'space-between',
    },
  },
  creatorAvatarStyle: {
    display: 'inline-block',
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    backgroundColor: '#ffffff',
    marginRight: '0.5em',
    alignSelf: 'center'
  },

  sucessDialogHeadericon: {
    height: 50, width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    top: -25,
    backgroundColor: colors.white
  },
  dialogContainer: {
    '& .MuiDialog-paper': {
      overflow: 'visible !important'
    }
  },
  headerStyle: {
    maxWidth: '1000px',
    [theme.breakpoints.up('md')]: {
      padding: '0px',
    },
  },
  detailStyle: {
    maxWidth: '1000px',
    [theme.breakpoints.up('md')]: {
      padding: '0px',
    },
  },
  videoWrapperStyle: {
    backgroundColor: 'black',
    marginBottom: '1em',
    maxWidth: '880px',
    maxHeight: '509px',
    paddingBottom: '56.25%',
    [theme.breakpoints.down('959')]: {
      paddingBottom: '56.25%',
    },
  },
  iframeStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  actionBoxStyle: {
    backgroundColor: 'var(--primary-color3)',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
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
    padding: '0.5em 0px 0.5em',

    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('1080')]: {
      position: 'static',
      height: '3.5em',
      width: 'fit-content',
      flexDirection: 'row',
      justifyContent: 'center',
      padding: '0px 0.5em 0px',
    },
  },
  actionBoxMobileWrapper: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between"
  },
  iconsBoxStyle: {
    [theme.breakpoints.down('1080')]: {
      display: 'flex',
      paddingRight: 4,
    },
  },
  actionBoxButtonStyle: {
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
    }
  },
  carouselImageStyle: {
    borderRadius: '15px',
    objectFit: 'cover',
    width: '180px',
    height: '200px',
  },
  enlargedImageDialogStyle: {
    padding: '4px',
  },
  enlargedImageDialogPaperStyle: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    width: '100%',
  },
  enlargedImageDialogCloseIcon: {
    color: colors.white,
  },
  sliderImageStyle: {
    alignItems: 'center',
    width: '100%',
    height: 'auto',
  },
  enlargedImageContainer: {
    position: 'relative',
    margin: 'auto',
    width: 'fit-content',
    padding: 12,
  },
  enlargedImageStyle: {
    alignSelf: 'center',
    maxWidth: '840px',  
    padding: 0,
    [theme.breakpoints.up('980')]: {
      width: '840px',
    },
    [theme.breakpoints.down('980')]: {
      width: '600px',
    },
    [theme.breakpoints.down('770')]: {
      width: '450px',
    },
    [theme.breakpoints.down('550')]: {
      width: '250px',
    },
  },
  cancelEnlargedImageBtn: {
    backgroundColor: colors.secondary,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '34px',
    height: '34px',
    borderRadius: '100%',
    border: '2px solid',
    borderColor: colors.white,
    zIndex: '100',
  },
  descriptionHeadingStyle: {
    marginTop: '1em',
    fontWeight: '900',
    fontSize: '2.2rem',
  },
  descriptionBodyStyle: {
    marginBottom: '0.7em',
    color: 'rgba(0, 0, 0, 0.54)',
    '& .ql-editor': {
      fontSize: '1.01rem',
      fontFamily: 'Raleway,Roboto,sans-serif',
      padding: '4px 0',
      lineHeight: 1.9,
    },
  },
  materialsUsedStyle: {
    display: 'inline-block',
    fontSize: '1.5rem',
    padding: '0.2em 0.5em',
    color: 'var(--primary-color3)',
    borderRadius: '15px',
    border: '1px solid var(--primary-color3)',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  },
  tagsBoxStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20
  },
  tagsStyle: {
    backgroundColor: 'var(--text-color3)',
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
  commentSectionStyle: {
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2.5em',
    marginBottom: '2.5em',
    borderRadius: '15px',
    backgroundColor: 'var(--text-color3)',
  },
  customLabelStyle: {
    '&.MuiFormLabel-root.Mui-focused': {
      color: 'var(--primary-color3)',
    },
  },
  secondaryLink: {
    color: 'var(--primary-color3)',
    '&:hover': {
      color: 'var(--secondary-color6)',
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
  positionRelative: { position: 'relative', borderRadius: 6, overflow: 'hidden' },
  positionAbsolute: { position: 'absolute' },
  marginBottom1em: { marginBottom: '1em' },
  errorBox: {
    width: '100%',
    padding: '1em',
    borderRadius: 6,
    borderWidth: '1px',
    borderColor: 'var(--primary-color2)',
    backgroundColor: 'var(--secondary-color1)',
  },
  error: {
    color: 'var(--primary-color2)',
  },
  dialogButtonContainer: {
    padding: '16px 24px',
  },
  prevArrowStyle: {
    display: 'flex',
    height: '200px',
    width: '30px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15px 0 0 15px',
    background: 'var(--text-color2)',
    zIndex: '10',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    backgroundColor: 'var(--primary-color3)',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
    },
  },
  nextArrowStyle: {
    display: 'flex',
    height: '200px',
    width: '30px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 15px 15px 0',
    background: 'var(--text-color2)',
    zIndex: '10',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    backgroundColor: 'var(--primary-color3)',
    '&:hover': {
      backgroundColor: 'var(--secondary-color6)',
    },
  },
  enlargedImageArrowStyle: {
    display: 'flex',
    height: '40px',
    width: '40px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    background: '#767474',
    zIndex: '10',
    margin: '4px',
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    backgroundColor: '#00B8C4', '&:hover': { backgroundColor: '#03848C' },
  }
});

const useStyles = makeStyles(styles);

export const sliderSettings = images_num => ({
  className: 'center slider detail-page-slider',
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

export function NextArrow(props) {
  const { className, onClick } = props;
  const classes = useStyles();
  return (
    <div
      className={clsx(className, classes.nextArrowStyle)}
      onClick={onClick}
    />
  );
}

export function PrevArrow(props) {
  const { className, onClick } = props;
  const classes = useStyles();
  return (
    <div
      className={clsx(className, classes.prevArrowStyle)}
      onClick={onClick}
    />
  );
}

export function EnlargedImgArrow (props) {
  const { className, onClick } = props;
  const classes = useStyles();
  return (
    <div
      className={clsx(className, classes.enlargedImageArrowStyle)}
      onClick={onClick}
    />
  )
} 

export default styles;
