const styles = theme => ({
  root: {
    paddingBottom: '2em',
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    justifyContent: 'center',
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
    '& .MuiGrid-root.MuiGrid-container': {
      width: '100%',
    },
  },
  mainContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '2000px',
    width: '100%',
  },
  circularProgressStyle: {
    color: 'var(--primary-color3)',
  },
});

export default styles;
