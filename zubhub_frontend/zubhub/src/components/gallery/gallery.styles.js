export const galleryStyles = theme => ({
  container: ({ imgSize }) => {
    let columns = '1fr';
    let rows = '200px';

    if (imgSize == 2) {
      columns = '1.5fr 1fr';
    }

    if (imgSize > 2) {
      columns = '1.5fr 1fr';
      rows = '100px 100px';
    }

    return {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: columns,
      gridTemplateRows: rows,
      '& > div:nth-child(1)': {
        gridRow: imgSize > 2 ? '1 / span 2' : '1fr',
      },

      '& > div': {
        borderRadius: 6,
        overflow: 'hidden',
        '& > img': {
          height: '100%',
          width: '100%',
          objectFit: 'cover',
        },
      },
    };
  },
  containerLinear: {
    marginTop: 20,
    overflow: 'auto',
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      width: 'fit-content',
    },
    '& > div > div': {
      height: 200,
      width: 200,
      borderRadius: 4.5,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      background: '#eee',

      '& img': {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
      },
    },
  },
});
