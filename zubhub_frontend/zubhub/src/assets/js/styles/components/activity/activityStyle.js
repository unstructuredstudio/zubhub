export const style = theme => ({
  activityCardContainer: {
    position: 'relative',
    maxWidth: '350px',
    minWidth: '300px',
    height: '95%',
  },
  activityCard: {
    maxWidth: '100%',
    borderRadius: '15px',
    position: 'relative!important',
    height: '100%',
  },
  opacity: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    top: 0,
    left: 0,
    opacity: 0.4,
  },
  activityCardImage: {
    width: '100%',
    position: 'absolute',
    height: '100%',
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
    right: '10%',
    display: 'flex',
  },
  activityTagPill: {
    backgroundColor: 'white',
    color: 'var(--text-color2)',
    border: '1px solid var(--text-color2)',
    '&:hover': {
      backgroundColor: 'var(--text-color2)',
      color: 'white',
      border: '1px solid white',
    },
  },
  activityTagsShowMore: {
    '&:hover': {
      backgroundColor: 'white',
      color: 'var(--text-color2)',
      border: '1px solid white',
    },
  },
  tagsShowMoreIconContainer: {
    //position: 'absolute',
  },
  tagsShowMoreList: {
    position: 'absolute',
    right: '0%',
    backgroundColor: 'white',
    maxHeight: '12em',
    overflow: 'auto',
    borderRadius: '10px',
  },

  activityCardContent: {
    width: '100%',
    position: 'relative',
  },
  activityCardInfoBox: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  projectsCount: {
    color: 'white',
    backgroundColor: 'var(--secondary-color6)',
    borderRadius: '15px',
    padding: '5px 10px',
  },
  projectsCountNumber: {
    color: 'white',
    fontWeight: 900,
    marginLeft: '5px',
  },
  activityTitle: {
    fontSize: '1.1rem',
    fontWeight: '900',
    color: 'var(--text-color1)',
    // width: '80%',
    textAlign: '-webkit-auto',
  },
});
