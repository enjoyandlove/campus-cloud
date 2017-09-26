import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';

// generateExcelFile

export const createSpreadSheet = (data: any[], fields: Array<string>, filename = 'download') => {
  const parseData = unparse({
    fields,
    data: [...data]
  })

  const file = new File(
    [parseData],
    `${filename}.csv`,
    { type: 'text/csv;charset=utf-8' }
  );

  saveAs(file);
};


