export const style = {
  activityCardContainer:{
    position: 'relative',
    width: '300px'
  },
  activityCard:{
    maxWidth: '100%',
    borderRadius: '15px',
    position: 'relative!important'
  },
  activityCardImage: {
    width: '100%',
    objectFit: 'cover',
    position: 'absolute',
    height: '17em',
  },
  mediaBoxStyle: {
    width: '100%',
    height: '17em',
    position: 'relative',
    padding: '2%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTagsBox: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex'
  },
  activityTagPill: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    '&:hover': {
      backgroundColor: 'white',
      backgroundSize: '100%',
      color: '#747070',
    },
  },
  
  activityCardContent: {
     padding: '10px!important',
    width: '100%'
  },
  activityCardInfoBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  projectsCount: {
    color: '#00B8C4'
  },
  activityTitle: {
    fontWeight: 900,
  }
}