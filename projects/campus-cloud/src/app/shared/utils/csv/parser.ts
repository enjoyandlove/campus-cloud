import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';

export enum Formats {
  timeFormat = 'h:mm A',
  dateFormat = 'M/DD/YYYY',
  timeFormatLong = 'h:mm:ss A',
  timeDurationFormat = 'HH:mm:ss',
  dateTimeFormat = 'M/DD/YYYY h:mm A'
}

export const createSpreadSheet = (data: any[], fields: Array<string>, filename = 'download') => {
  const parseData = unparse({
    fields,
    data: [...data]
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
