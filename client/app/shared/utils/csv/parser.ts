import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

export const createSpreadSheet = (
  data: any[],
  fields: Array<string>,
  filename = 'download',
) => {
  const parseData = unparse({
    fields,
    data: [...data],
  });

  // Microsoft Edge does not
  // yet support File, switching to Blob...

  // const file = new File(
  //   [parseData],
  //   `${filename}.csv`,
  //   { type: 'text/csv;charset=utf-8' }
  // );

  const file = new Blob([parseData], { type: 'text/csv;charset=utf-8' });

  saveAs(file, `${filename}.csv`);
};
