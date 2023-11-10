export const customStyles = theme => ({
  pillContainer: {
    marginTop: 20,
  },
  pill: {
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px 8px 8px',
    gap: 6,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  projectGridStyle: {
    position: 'relative',
  },
  overLay: { height: '100%', width: '100%', position: 'absolute', backgroundColor: 'transparent', zIndex: 1 },
  blurOverLay: {
    borderRadius: '6.93px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(5px)',
  },
  div: { position: 'relative', marginLeft: '16px', marginRight: '16px', cursor: 'pointer' },
  gridModal: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: '15px',
    cursor: 'pointer',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  modalBlurred: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
  },
});
