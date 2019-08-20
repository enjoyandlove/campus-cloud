import { Injectable } from '@angular/core';

import { CCImage } from '@campus-cloud/shared/models/image';
import { CPI18nService, ImageValidatorService } from '@campus-cloud/shared/services';

const threeHundredKb = 3e5;

@Injectable()
export class TileImageValidatorService extends ImageValidatorService {
  constructor(cpI18n: CPI18nService) {
    super(cpI18n);
  }
  validate(file: File, maxImageSize = threeHundredKb): null | string[] {
    const errors = [];

    if (!CCImage.validateSize(file, maxImageSize)) {
      errors.push(this.cpI18n.translate('error_file_is_too_big'));
    }

    if (!CCImage.validateType(file)) {
      errors.push(this.cpI18n.translate('error_invalid_extension'));
    }

    if (errors.length) {
      return errors;
    }

    return null;
  }
}
