import * as JSZip from 'jszip';

export const compressFiles = async (files: any[]) => {
  const zip = new JSZip();

  if (files && files.length) {
    files.map(({ name, content }) => zip.file(`${name}.csv`, content));
  }

  return await zip.generateAsync({ type: 'blob' });
};
