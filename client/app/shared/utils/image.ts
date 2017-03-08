const MAX_IMAGE_SIZE = 8000000; // 8MB
const VALID_EXTENSIONS = [ 'jpg', 'jpeg', 'png' ];

const isSizeOk = function isSizeOk(fileSize: number, maxSizeBytes: number) {
  return fileSize < maxSizeBytes;
};

const isValidExtension = function
  isValidExtension(
      fileExtension: string,
      validExtensions: string[]
  )
{
  return validExtensions.indexOf(fileExtension.toLowerCase()) > -1;
};

export const CPImage = {
  isSizeOk,
  MAX_IMAGE_SIZE,
  isValidExtension,
  VALID_EXTENSIONS
};
