import { saveAs } from 'file-saver';
import { unparse } from 'papaparse';
import JSZip from 'jszip';

export enum Formats {
  timeFormat = 'h:mm A',
  dateFormat = 'M/DD/YYYY',
  timeFormatLong = 'h:mm:ss A',
  timeDurationFormat = 'HH:mm:ss',
  dateTimeFormat = 'M/DD/YYYY h:mm A'
}

export const createSpreadSheet = (
  data: any[],
  fields: Array<string>,
  filename = 'download',
  download = true
) => {
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

  if (!download) {
    return file;
  }

  saveAs(file, `${filename}.csv`);
};

export const compressFiles = (files: any[], filename = 'download') => {
  let zip = new JSZip();

  if (files && files.length) {
    files.map(({ name, content }) => zip.file(`${name}.csv`, content));
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `${filename}.zip`);
  });
};
