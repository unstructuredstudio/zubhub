export const style = theme => ({
  activityCardContainer: {
    position: 'relative',
    // maxWidth: '350px',
    // minWidth: '300px',
  },
  activityCard: {
    maxWidth: '100%',
    height: '100%',
    minHeight: '34em',
    borderRadius: '20px',
    position: 'relative!important',
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
    objectFit: 'cover',
    height: '100%',
  },
  mediaBoxStyle: {
    width: '100%',
    height: '14em',
    position: 'relative',
    padding: '2%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCardContent: {
    width: '100%',
    position: 'relative',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    gap: '8px'
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
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--text-color1)',
  },
  activityDescription: {
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'start',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  activityCategoryContainer: {
    margin: '8px 0',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  activityCategory: {
    padding: '2px 10px',
    border: '1px solid #7E5B4B',
    borderRadius: '10em',
    background: '#F1D27C'
  },

  activityCreatorContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'start'
  },
  creatorBoxContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  creatorBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  creatorAvatar: {
    boxShadow: `0 3px 5px 2px rgba(0, 0, 0, .12)`,
  },
  creatorUsername: {
    flex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontWeight: '600',
    fontSize: '1.1em'
  },
  creatorUsernameTooltip: {
    maxWidth: '70%',
    marginRight: 'auto',
    fontWeight: '700',
  },
  creatorTag: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '500',
    fontSize: '1rem',
    textAlign: 'center',
  },

  footer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    display: 'flex',
  },
  captionStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captionIconStyle: {
    backgroundColor: '#eee',
    padding: '2px 7px',
    borderRadius: 25,
    justifyContent: 'space-between',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    marginRight: '1em',
    '& svg': {
      fill: 'rgba(0,0,0,0.54)',
      marginRight: '0.5em',
      fontSize:'1.1rem',
    },
  },
  date: {
    fontSize: '0.9rem',
    fontWeight: '600',
    marginLeft: 'auto'
  }
});
