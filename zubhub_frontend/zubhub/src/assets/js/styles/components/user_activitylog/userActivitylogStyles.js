const styles = themes => ({

    activityLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    message: {
        fontSize: '16px',
        font: 'Raleway',
        color: '#000000',
        marginBottom: '0px',
        marginLeft: '16px',
        textDecoration: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    time: {
        marginTop: '0px',
        fontSize: '14px',
        color: '#00B8C4',
        marginLeft: '16px',
    },
      text: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '4px',
        width: '76%',
    },
    activityStyle: {
        display: 'flex',
        paddingLeft: '1.5%',
        paddingRight: '20px',
        '&:hover': {
            backgroundColor: '#FFF7D4',
            fontColor: '#FFFFFF',
            borderRadius: '17px',
        },
        
    },
    iconStyle: {
        '& svg': {
          fill: 'rgba(0,0,0,0.54)',
        },
      },
});

export default styles;