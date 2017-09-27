import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';

export const createSpreadSheet = (data: any[], fields: Array<string>, filename = 'download') => {
  console.log('calling createSpreadSheet with ', data);

  const parseData = unparse({
    fields,
    data: [...data]
  })

  console.log('parseData ', parseData);

  const file = new File(
    [parseData],
    `${filename}.csv`,
    { type: 'text/csv;charset=utf-8' }
  );

  console.log('file ', file);
  saveAs(file);

  console.log('saveAs');
};


