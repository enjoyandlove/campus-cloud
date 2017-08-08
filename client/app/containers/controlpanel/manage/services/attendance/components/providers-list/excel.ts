const columns = [
  'Service Provider',
  'Email',
  'Averate Rating',
  'Total Ratings',
  'Total Visits',
];


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

    line += array[i]['provider_name'] + ',';
    line += array[i]['email'] + ',';
    line += array[i]['avg_rating_percent'] === -1 ? 0 : array[i]['avg_rating_percent'] + ',';
    line += array[i]['num_ratings'] + ',';
    line += array[i]['total_visits'] + ',';

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


