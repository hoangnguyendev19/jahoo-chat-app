import moment from 'moment';

export const convertToDate = (dob) => {
  const formattedDate = moment(dob).format('DD/MM/YYYY');
  return formattedDate;
};

export const convertToTime = (date) => {
  const now = moment();
  const then = moment(date);

  const secondsDiff = now.diff(then, 'seconds');

  if (secondsDiff <= 0) {
    return 'Vừa gửi';
  }

  if (secondsDiff < 60) {
    return secondsDiff + ' giây trước';
  } else if (secondsDiff < 3600) {
    const minutesDiff = now.diff(then, 'minutes');
    return minutesDiff + ' phút trước';
  } else if (secondsDiff < 86400) {
    const hoursDiff = now.diff(then, 'hours');
    return hoursDiff + ' giờ trước';
  } else {
    const daysDiff = now.diff(then, 'days');
    return daysDiff + ' ngày trước';
  }
};
