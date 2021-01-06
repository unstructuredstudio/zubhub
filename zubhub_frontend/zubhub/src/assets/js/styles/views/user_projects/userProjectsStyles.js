const styles = (theme) => ({
    root: {
      paddingBottom: "2em",
      flex: "1 0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,204,0,1)",
      background:
        "linear-gradient(to bottom, rgba(255,204,0,1) 0%, rgba(255,229,133,1) 25%, rgba(255,255,255,1) 61%, rgba(255,255,255,1) 100%)",
      "& .MuiGrid-root.MuiGrid-container": {
        width: "100%",
      },
    },
    mainContainerStyle: {
      maxWidth: "2000px",
      width: "100%",
    },
  
    pageHeaderStyle: {
      marginTop: "1em",
      fontWeight: 900,
      textAlign: "center",
    },
    projectGridStyle: {
      marginBottom: "2em",
    },
    buttonGroupStyle: {
      paddingLeft: "2em",
      paddingRight: "2em",
      display: "block",
      marginTop: "2em",
      maxWidth: "2000px",
      width: "100%",
    },
    floatRight: {
      float: "right",
    },
    floatLeft: {
      float: "left",
    },
  });

  export default styles;