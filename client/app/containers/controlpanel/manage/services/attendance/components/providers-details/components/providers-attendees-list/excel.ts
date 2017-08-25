import * as moment from 'moment';

const columns = [
  'Attendee Name',
  'Email',
  'Average Rating',
  'Feedback',
  'Checked-in Method',
  'Checked-in Time',
];

const check_in_method = {
  1: 'Web check-in',
  3: 'App check-in'
};


export function generateExcelFile(data: any[]) {
  const array = typeof data !== 'object' ? JSON.parse(data) : data;

  let str = '';
  let title = '';

  columns.forEach(column => {
    title += column + ',';
  });

  str += title + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';

    line += array[i]['firstname'] + array[i]['lastname'] + ',';
    line += array[i]['email'] + ',';
    line += array[i]['feedback_rating'] === -1 ? 0 : array[i]['feedback_rating'] + ',';
    line += array[i]['feedback_text'] + ',';
    line += check_in_method[array[i]['check_in_method']] + ',';
    line += moment.unix(array[i]['check_in_time']).format('MMMM Do YYYY - h:mm a') + ',';

    line.slice(0, line.length - 1);

    str += line + '\r\n';
  }

  let link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(str));
  link.setAttribute('download', 'download.csv');
  document.body.appendChild(link); // Required for FF

  link.click();

  // window.open('data:text/csv;charset=utf-8,' + encodeURI(str));
};


