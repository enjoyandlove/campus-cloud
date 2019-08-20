import { CCImage } from '@campus-cloud/shared/models';
import { Injectable } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';

@Injectable()
export class LogoValidatorService {
  constructor(private cpI18n: CPI18nService) {}

  valideType = ['image/png'];

  validate(file: File): null | string[] {
    const errors = [];

    if (!CCImage.validateSize(file)) {
      errors.push(this.cpI18n.translate('error_file_is_too_big'));
    }

    if (!CCImage.validateType(file, this.valideType)) {
      errors.push(this.cpI18n.translate('error_invalid_extension'));
    }

    if (errors.length) {
      return errors;
    }

    return null;
  }
}
