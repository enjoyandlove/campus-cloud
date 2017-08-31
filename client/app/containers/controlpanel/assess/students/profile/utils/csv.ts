
import * as moment from 'moment';

const columns = [
  'Check-In Item',
  'Type',
  'Check-In Date',
  'Response Date',
  'Rating',
  'Response',
];



export function generateExcelFile(data: any[], fullName = 'download') {
  const array = typeof data !== 'object' ? JSON.parse(data) : data;

  let str = '';
  let title = '';

  columns.forEach(column => {
    title += column + ',';
  });

  str += title + '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';

    let name;

    try {
      name = array[i]['name'].trim().replace(/[ ]*,[ ]*|[ ]+/g, ' ');
    } catch (error) {
      name = ''
    }

    line += name + ',';

    line += array[i]['type'] + ',';

    line += moment.unix(array[i]['time_epoch']).format('MMMM Do YYYY - h:mm a') + ',';

    line += array[i]['feedback_time_epoch'] === 0
      ? 'No Feedback Provided'
      : moment.unix(array[i]['feedback_time_epoch']).format('MMMM Do YYYY - h:mm a') + ',';

    line += array[i]['user_rating_percent'] === -1
      ? 'No Rating Provided' + ','
      : ((array[i]['user_rating_percent'] / 100) * 5).toFixed(0) + ',';


    line += array[i]['user_feedback_text'].trim().replace(/[ ]*,[ ]*|[ ]+/g, ' ') + ',';

    line.slice(0, line.length - 1);

    str += line + '\r\n';
  }

  let link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(str));
  link.setAttribute('download', `${fullName}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();

  // window.open('data:text/csv;charset=utf-8,' + encodeURI(str));
};


