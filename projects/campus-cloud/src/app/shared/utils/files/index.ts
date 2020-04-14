import * as JSZip from 'jszip';

export const compressFiles = (files: any[], filename = 'download') => {
  const zip = new JSZip();

  if (files && files.length) {
    files.map(({ name, content }) => zip.file(`${name}.csv`, content));
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `${filename}.zip`);
  });
};
