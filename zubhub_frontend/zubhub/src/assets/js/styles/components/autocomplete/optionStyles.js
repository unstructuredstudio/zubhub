const styles = theme => ({
  option: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
    width: '100%',
    height: '100%',
    maxHeight: '54px',
    textDecoration: 'none',
    color: 'black',
  },
  infoWrapper: {
    display: 'flex',
    flexFlow: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  optionTitleWrapper: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    [theme.breakpoints.down('497')]: {
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      lineHeight: '1.2em'
    },
  },
  optionTitle: {
    display: 'inline',
    fontFamily: 'inherit',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('497')]: {
      fontSize: '14px',
      textWrap: 'wrap',
    },
  },
  shortInfo: {
    fontSize: '12px',
    color: 'gray',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
  },
  optionImageWrapper: {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '40px',
    width: '40px',
    overflow: 'hidden',
    borderRadius: '5px',
    [theme.breakpoints.down('497')]: {
      width: '54px',
      height: '54px',
    },
  },
  optionImage: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    [theme.breakpoints.down('497')]: {
      width: '54px',
      height: '54px',
    },
  },
});

export default styles;
