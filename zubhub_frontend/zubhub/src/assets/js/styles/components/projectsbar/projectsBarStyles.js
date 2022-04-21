const styles = theme => ({
    descriptionHeadingStyle: {
        marginTop: '0.5em',
        fontWeight: 900,
        fontSize: '2.2rem',
    },
    projectsBarWrapperStyle: {
        maxWidth: '1100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2.5em',
        marginBottom: '2.5em',
        borderRadius: '15px',
        backgroundColor: '#E4E4E4',
    },
    projectsBarInnerWrapperStyle: {
        maxWidth: '1000px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '1em',
        marginBottom: '1.5em',
        borderRadius: '15px',
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
    },
    projectsMobileBarInnerWrapperStyle: {
        maxWidth: '1000px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '1em',
        marginBottom: '1.5em',
        borderRadius: '15px',
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        overflowX: 'scroll',
    },
});

export default styles;