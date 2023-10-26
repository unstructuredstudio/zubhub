import { colors } from '../../assets/js/colors';

export const activityDefailsStyles = theme => ({
    container: {
      borderRadius: 8,
      backgroundColor: colors.white,
      padding: 24,
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
    socialButtons: {
        backgroundColor: colors.primary,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px 0',
        borderRadius: 8,
    },
    moreTextTitle: {
        marginTop: 50,
        marginBottom: 30,
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.black,
    },
    card: {
      borderRadius: 8,
      backgroundColor: colors.white,
      padding: 24,
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
    closed: {
      height: 0,
      transition: '0.4s',
      overflow: 'hidden',
    },
    expandableMargin: {
      // marginBottom: 10,
      marginTop: 30,
    },
    expanded: {
        transition: '0.4s',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        marginTop: 20,
  },
  pdfStyle: {
    paddingTop: '2rem',
  },
  pdfLogoStyle: {
    width: '4.5rem',
    height: '1rem',
    borderRadius: '0',
  },
  pdfMainLogo:{
    padding: '0',
  },
  justifyPdf: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '2rem',
    padding: '0',
  },
  pdfTitle: {
    width: '23rem',

    fontFamily: 'Raleway',
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  pdfSubtitle: {
    fontFamily: 'Raleway',
    fontSize: '1rem',
    fontWeight: '600',
    height: '1.5rem',
    marginBottom: '1rem'
  },

  creatorProfilePdfStyle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    fontSize: '0.5rem'
  },
  verticalSpace:{
    marginBottom: '2rem',
  },
  textStyle:{
    fontSize: '0.7rem'
  },
  divFooter: {
    '@media screen' :{
      display: 'none',
    },
    '@media print': {
      position: 'fixed',
      bottom: 0,
    },
  },
  imageStyle:{
    width: '1rem',
    display: 'flex',
    columnGap: '1rem',
  },
  imageIndividualStyle:{
    width: '8rem',
    height: '8rem',
    borderRadius: '0.3rem'
  },
  footerStyle:{
    backgroundColor: 'var(--primary-color1)',
    display: 'flex',
    alignItems: 'center',
    marginTop: 'auto',

    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  flexStyle:{
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '12rem'
  },
  linkStyle:{
    color: 'white',
  },
  pdfFooterLogoStyle: {
    width: '8.25rem',
    height: '1.9375rem', 
  },
  customTypographyStyle:{
    margin: '0',
  }
});
