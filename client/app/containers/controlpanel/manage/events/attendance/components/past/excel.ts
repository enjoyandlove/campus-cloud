import { CPDate } from '../../../../../../../shared/utils/date';

const columns = [
  'Attendant',
  'Attendee Email',
  'RSVP',
  'Checked In Time',
  'Rating',
  'User Feedback',
  'Checked-in Method'
];

const check_in_method = {
  1: 'Web',
  3: 'QR Code'
};

const rsvp = {
  1: 'Yes',
  0: 'No'
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

    line += array[i]['firstname'] + ' ' + array[i]['lastname'] + ',';
    line += array[i]['email'] + ',';
    line += rsvp[array[i]['rsvp']] + ',';
    line += CPDate.fromEpoch(array[i]['check_in_time']) + ',';
    line += ((array[i]['feedback_rating'] * 5) / 100).toFixed(2) + ',';
    line += array[i]['feedback_text'] + ',';
    line += check_in_method[array[i]['check_in_method']];

    line.slice(0, line.length - 1);

    str += line + '\r\n';
  }

  let link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(str));
  link.setAttribute('download', 'download.csv');
  document.body.appendChild(link); // Required for FF

  link.click();
};


