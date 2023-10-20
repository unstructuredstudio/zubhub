import { colors } from "../../assets/js/colors";

const styles = theme => ({
    navbar: {
        height: 50,
        backgroundColor: colors.secondary,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
    },
    body: {
        margin: 40,
        border: 'solid 30px white',
        borderRadius: 50,
        overflow: 'hidden',
        [theme.breakpoints.down('sm')]: {
            margin: '30px 15px',
            borderWidth: 10
        }
    },
    previewheader: {
        height: 50,
        backgroundColor: colors.white,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px'
    },
    breadcrum: {
        height: 50,
        backgroundColor: colors.primary
    },
    root: {
        flex: '1 0 auto',
    },
    previewRoot: {
        top: 0,
        position: 'fixed',
        width: '100vw',
        left: 0,
        background: 'linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)',
        backgroundRepeat: 'no-repeat',
        zIndex: 2,
        height: '100vh',
        overflow: 'auto'
    },
    dialogTitle: {
        fontSize: '18px !important',
        lineHeight: '26px !important',
        marginTop: 0
    },
    projectDetailHeaderStyle: {
        paddingTop: '1.5em',

        background: 'transparent',

        [theme.breakpoints.down('511')]: {
            paddingTop: '4em',
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
        borderRadius: 6,
        overflow: 'hidden',
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
        fontWeight: 'bold',
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
        color: '#00B8C4',
        borderRadius: '15px',
        border: '1px solid #00B8C4',
        marginRight: '0.5em',
        marginBottom: '0.5em',
    },
    tagsBoxStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20
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
    positionRelative: { position: 'relative', borderRadius: 6, overflow: 'hidden' },
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
    dialogButtonContainer: {
        padding: '16px 24px',
    },
});

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

export function PrevArrow(props) {
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
