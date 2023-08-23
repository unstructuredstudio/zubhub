export const galleryStyles = theme => ({
    container: ({ imgSize }) => {
        let columns = '1fr'
        let rows = '150px';

        if (imgSize == 2) {
            columns = '1.5fr 1fr'
        }

        if (imgSize > 2) {
            columns = '1.5fr 1fr'
            rows = '75px 75px'
        }

        return {
            display: 'grid',
            gap: 12,
            gridTemplateColumns: columns,
            gridTemplateRows: rows,
            '& > div:nth-child(1)': {
                gridRow: imgSize > 2 ? '1 / span 2' : '1fr'
            },

            '& > div': {
                borderRadius: 6,
                overflow: 'hidden',
                '& > img': {
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover'
                }
            }
        }
    },
    containerLinear: {
        display: 'flex',
        gap: 12,
        marginTop: 20,
        overflow: 'auto',
        '& > div': {
            minWidth: 100,
            maxWidth: 100,
            height: 90,
            borderRadius: 4.5,
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative'
        }
    }
})