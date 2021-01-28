const dFormatter = str => {
  const date = new Date(str);

    const seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      let result = Math.round(interval);
      return {value:result, key:(result > 1 ? "years" : "year")};
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        let result = Math.round(interval);
        return {value:result, key:(result > 1 ? "months" : "month")};
    }
    interval = seconds / 86400;
    if (interval > 1) {
        let result = Math.round(interval);
        return {value:result, key:(result > 1 ? "days" : "day")};
    }
    interval = seconds / 3600;
    if (interval > 1) {
        let result = Math.round(interval);
        return {value:result, key:(result > 1 ? "hours" : "hour")};
    }
    interval = seconds / 60;
    if (interval > 1) {
        let result = Math.round(interval);
        return {value:result, key:(result > 1 ? "minutes" : "minute")};
    }
    let result = Math.round(interval);
    return {value:result, key:(result > 1 ? "seconds" : "second")};
  }

  export default dFormatter;
