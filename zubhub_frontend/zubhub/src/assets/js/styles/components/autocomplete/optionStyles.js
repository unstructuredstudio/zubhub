const styles = theme => ({
  option: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    margin: '-10px -15px',
    padding: '10px 15px',
    textDecoration: 'none',
    color: 'black',
  },
  infoWrapper: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    maxWidth: '50%',
  },
  optionTitleWrapper: {
    flex: '1 1 max-content',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  optionTitle: {
    display: 'inline',
    fontFamily: 'inherit',
  },
  shortInfo: {
    fontSize: '12px',
    color: 'gray',
    marginLeft: '10px',
  },
  optionImageWrapper: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40px',
    width: '40px',
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  optionImage: {
    height: '40px',
    backgroundColor: 'white',
  },
});

export default styles;
