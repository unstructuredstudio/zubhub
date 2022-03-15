const NOTIFICATION_TYPE = {
    BOOKMARK: 1,
    CLAP: 2,
    COMMENT: 3,
    FOLLOW: 4,
    FOLLOWING_PROJECT: 5,
  };

  const PHRASES = {
      1: ' bookmarked "',
      2: ' clapped for "',
      3: ' comment on "',
      4: ' started following you!',
      5: ' posted a new project!',
      6: '!"',
  };

export const renderTimeAgo = (notification) => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = week * 4;
    const year = day * 365;

    let t =
      Date.now() -
      new Date(JSON.parse('"' + notification.time + '"')).getTime();
    let plural = '';
    let timeType = '';
    var type;

    if (t < minute) {
      timeType += 'second';
      type = second;
    } else if (t >= minute && t < hour) {
      timeType += 'minute';
      type = minute;
    } else if (t >= hour && t < day) {
      timeType += 'hour';
      type = hour;
    } else if (t >= day && t < week) {
      timeType += 'day';
      type = day;
    } else if (t >= week && t < month) {
      timeType += 'week';
      type = week;
    } else if (t >= month && t < year) {
      timeType += 'month';
      type = month;
    } else if (t >= year) {
      timeType += 'year';
      type = year;
    }

    const num = Math.max(1, Math.round(t / type));
    if (num >= 2) plural += 's';

    return num.toString() + ' ' + timeType + plural + ' ago';
  };

  export const getNotification = (notification) => {
      const type = notification.type;
      return (
          <>
            <strong>{notification.source.username}</strong>{PHRASES[type]}{(type < 4) && (notification.projectName + PHRASES[6])}
          </>
      );
    };
