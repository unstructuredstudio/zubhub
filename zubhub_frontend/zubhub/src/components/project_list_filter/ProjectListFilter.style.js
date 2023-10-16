import { colors } from "../../assets/js/colors";

const styles = theme => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        backgroundColor: colors.white,
        marginTop: 40
    },
    projectsListsTitile: {
        fontSize: '30px',
        fontWeight: 800,
        fontFamily: 'Raleway',
        letterSpacing: '0em',
        textAlign: 'center',
        marginTop: 40,
        alignSelf: 'center',
    },
    categoriesContainer: {
        width: '70%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
        padding: '1em 0',
        flexWrap: 'wrap',
    },
    category: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            backgroundColor: '#ccc',
            cursor: 'pointer',
        },
        paddingLeft: '10px',
        paddingRight: '10px',
        height: '35px',
        borderRadius: '20px',
        margin: 5
    }
});

export default styles;
