const styles = theme => ({
  option: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '8px',
    width: '100%',
    height: '100%',
    textDecoration: 'none',
    color: 'black',
  },
  infoWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    //first approach 
    // [theme.breakpoints.down('1168')]: {
    //   flexFlow: 'column',
    //   alignItems: 'flex-start'
    // }
    // justifyContent: 'space-between',

    //second approach
    flexWrap: 'wrap',
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
    //second approach
    marginRight: '4px',
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
    //first approach
    // [theme.breakpoints.up('1168')]: {
    //   // marginLeft: 12,
    // },
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
      width: '46px',
      height: '46px',
    },
  },
  optionImage: {
    width: '40px',
    height: '40px',
    [theme.breakpoints.down('497')]: {
      width: '46px',
      height: '46px',
    },
  },
});

export default styles;
