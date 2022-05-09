const styles = theme => ({
  option: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    textDecoration: 'none',
    color: 'black',
  },
  infoWrapper: {
    display: 'flex',
    marginLeft: '0.3em',
    flexFlow: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' ,
  },
  optionTitleWrapper: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  optionTitle: {
    display: 'inline',
    fontFamily: 'inherit',
  },
  shortInfo: {
    fontSize: '12px',
    color: 'gray',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' ,
  },
  optionImageWrapper: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40px',
    width: '40px',
    overflow: 'hidden',
    borderRadius: '5px',
    flexShrink: '0',
  },
  optionImage: {
    height: '40px',
    width: '40px',
    backgroundColor: 'white',
  },
});

export default styles;
