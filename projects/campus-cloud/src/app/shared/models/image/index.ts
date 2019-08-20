import { MAX_UPLOAD_SIZE } from './../../constants/settings';

export class CCImage {
  static readonly validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

  static validateSize(file: File, size: number = MAX_UPLOAD_SIZE): boolean {
    if (size > MAX_UPLOAD_SIZE) {
      throw new Error('File size provided is bigger than accepted');
    }

    return file.size <= size;
  }

  static validateType(file: File, types: string[] = CCImage.validExtensions): boolean {
    if (!('type' in file)) {
      return false;
    }

    return types.includes(file.type);
  }

  static getImageDimensions(image: File): Promise<{ height: number; width: number }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const img = new Image();
        img.src = <string>fileReader.result;

        img.onload = () => resolve({ width: img.width, height: img.height });
      };

      fileReader.onerror = () => reject();

      fileReader.readAsDataURL(image);
    });
  }
}
