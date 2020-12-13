export default function dFormatter(str) {
    console.log(str);
    let date = new Date(str);

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      let result = Math.round(interval);
      return result +  (result > 1 ? " years" : " year") + " ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        let result = Math.round(interval);
        return result +  (result > 1 ? " months" : " month") + " ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        let result = Math.round(interval);
        return result +  (result > 1 ? " days" : " day") + " ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        let result = Math.round(interval);
        return result +  (result > 1 ? " hours" : " hour") + " ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        let result = Math.round(interval);
        return result +  (result > 1 ? " minutes" : " minute") + " ago";
    }
    let result = Math.round(interval);
    return result +  (result > 1 ? " seconds" : " second") + " ago";
  }