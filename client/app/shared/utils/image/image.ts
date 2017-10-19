const MAX_IMAGE_SIZE = 8000000; // 8MB
const VALID_EXTENSIONS = [ 'jpg', 'jpeg', 'png' ];

function isSizeOk(fileSize: number, maxSizeBytes: number) {
  return fileSize < maxSizeBytes;
};

function isValidExtension( fileExtension: string, validExtensions: string[]) {
  return validExtensions.includes(fileExtension.toLowerCase());
};

export const CPImage = {
  isSizeOk,
  MAX_IMAGE_SIZE,
  isValidExtension,
  VALID_EXTENSIONS
};
