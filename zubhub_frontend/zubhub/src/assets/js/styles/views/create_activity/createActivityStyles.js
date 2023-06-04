export const styles = theme => ({
  createActivityContainer: {
    backgroundColor: 'var(--primary-color2)',
    padding: '5vh 10%',
  },
  createActivityContainerTitle: {
    color: 'white',
    fontWeight: 900,
  },
  CreateActivityFormContainer: {
    backgroundColor: 'white',
    borderRadius: '15px',
    paddingBottom: '1em',
  },
  progressNumberStyle: {
    height: '30px',
    width: '30px',
    backgroundColor: 'white',
    color: 'var(--primary-color3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    position: 'absolute',
    top: '-10px',
    //left: '-15px'
  },
  createActivityStepContainer: {
    width: '90%',
    margin: 'auto',
  },
  activityCreationProgressBar: {
    width: '90%',
    margin: '8vh auto',
    height: '10px',
    backgroundColor: 'white',
    borderRadius: '10px',
    position: 'relative',
    textAlign: 'center',
  },
  activityCreationProgressBarScroller: {
    backgroundColor: 'var(--primary-color3)',
    height: '100%',
    borderRadius: '10px',
  },
  reactQuillStyle: {
    borderRadius: '15px',
  },
  imagePreview: {
    width: '100%',
    borderRadius: '15px 0px 15px 15px',
  },

  imagePreviewContainer: {
    position: 'relative',
    boxShadow: 'none',
    borderRadius: '15px 0px 15px 15px',
  },
  itemContainer: {
    position: 'relative',
  },

  closeIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    color: 'var(--primary-color1)',
  },
});
