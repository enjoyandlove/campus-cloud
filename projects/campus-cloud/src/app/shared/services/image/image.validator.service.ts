import { Injectable } from '@angular/core';

import { CPI18nService } from '../i18n.service';
import { CCImage } from '@campus-cloud/shared/models';

const validExtensionName = (extension: string) => {
  const validExtensions = ['png', 'jpg', 'jpeg'];
  return validExtensions.includes(extension);
};
const getFileNameExtension = (name: string) => {
  const nameLength = name.split('.').length;
  return name.split('.')[nameLength - 1];
};

@Injectable()
export class ImageValidatorService {
  readonly fileToBigError = 'error_file_is_too_big';
  readonly invalidExtensionError = 'error_invalid_extension';

  constructor(public cpI18n: CPI18nService) {}

  validate(file: File): null | string[] {
    const errors = [];

    if (!CCImage.validateSize(file)) {
      errors.push(this.cpI18n.translate(this.fileToBigError));
    }

    if (!CCImage.validateType(file) || !validExtensionName(getFileNameExtension(file.name))) {
      errors.push(this.cpI18n.translate(this.invalidExtensionError));
    }

    if (errors.length) {
      return errors;
    }

    return null;
  }
}
