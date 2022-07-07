const imgSize = '50px'
const imgSizeHover = '70px'
export const style = {
  creatorImage: {
    width: imgSize,
    height: imgSize,
    borderRadius: '50%',
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
    '&:hover': {
      width: imgSizeHover,
      height: imgSizeHover,
      border: '2px solid rgba(0, 0, 0, .12)'
    },
  },
  creatorImageBox:{
    position: 'absolute',
    left: `calc(${imgSize} / -2)`,
    zIndex: '1',
    '&:hover': {
      zIndex: '2',
      left: `calc(${imgSizeHover} / -2)`,
    }, 
  },
}