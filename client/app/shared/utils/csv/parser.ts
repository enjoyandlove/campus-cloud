import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';

export const createSpreadSheet = (data: any[], fields: Array<string>, filename = 'download') => {

  const parseData = unparse({
    fields,
    data: [...data]
  })

  // const file = new File(
  //   [parseData],
  //   `${filename}.csv`,
  //   { type: 'text/csv;charset=utf-8' }
  // );

  const file = new Blob([parseData], { type: 'text/csv;charset=utf-8' });
  console.log('Yo New', file);
  saveAs(file, `${filename}.csv`);
};


