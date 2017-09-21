const columns = [
  'Student Name',
  '# of Check-ins',
  '# of Responses',
  'Response Rate',
  'Average Rating',
  '# of Event Check-Ins',
  'Event Responses',
  'Event Response Rate',
  'Event Average Rating',
  '# of Service Check-ins',
  'Service Responses',
  'Services Response Rate',
  'Service Average Rating',
];


export function generateCSV(data: any[], fileName = 'download') {
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

    line += array[i]['total_checkins'] + ',';

    line += array[i]['total_responses'] + ',';

    line += array[i]['total_response_rate'].toFixed(1) + '%' + ',';

    line += 'MISSING' + ',';

    line += array[i]['event_checkins'] + ',';

    line += array[i]['event_responses'] + ',';

    line += array[i]['event_response_rate'].toFixed(1) + '%' + ',';

    line += 'MISSING' + ',';

    line += array[i]['service_checkins'] + ',';

    line += array[i]['service_responses'] + ',';

    line += array[i]['service_response_rate'].toFixed(1) + '%' + ',';

    line += array[i]['service_ratings'] + ',';

    line.slice(0, line.length - 1);

    str += line + '\r\n';
  }

  let link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(str));
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();

  // window.open('data:text/csv;charset=utf-8,' + encodeURI(str));
};


