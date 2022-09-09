export const style = {
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
    color: '#747070',
    border: '1px solid #747070',
    '&:hover': {
      backgroundColor: '#747070',
      color: 'white',
      border: '1px solid white',
    },
  },
  activityTagsShowMore: {
    '&:hover': {
      backgroundColor: 'white',
      color: '#747070',
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
    alignItems: 'flex-start',
  },
  projectsCount: {
    color: '#00B8C4',
  },
  activityTitle: {
    fontSize: '1.1rem',
    fontWeight: '900',
    width: '80%',
    textAlign: '-webkit-auto',
  },
};
