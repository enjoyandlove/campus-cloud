import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { API } from '@campus-cloud/config/api';
import { CPSession } from '@campus-cloud/session';
import { appStorage } from '@campus-cloud/shared/utils/storage';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { CPLogger } from '@campus-cloud/shared/services/logger/sentry.service';

const maxAllowed = 5e6; // 5MB

@Injectable()
export class FileUploadService {
  maxImageSize = maxAllowed;
  maxFileSize = maxAllowed;

  validFileTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  imageUploadUrl = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;

  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  static validFileSize(file: File, maxSize = maxAllowed) {
    return file.size <= maxSize;
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

  constructor(
    private http: HttpClient,
    private session: CPSession,
    private cpI18n: CPI18nService
  ) {}

  validImage(file: File, imageSize?: number): { valid: boolean; errors: Array<string> } {
    const maxSize = imageSize ? imageSize : this.maxImageSize;

    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateImage(file)
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file, maxSize)
    };

    const errors = [];

    if (!validType.valid) {
      errors.push(validType.message);
    }
    if (!validSize.valid) {
      errors.push(validSize.message);
    }

    return {
      valid: validType.valid && validSize.valid,
      errors
    };
  }

  validFile(file: File): { valid: boolean; errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateDoc(file)
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file, this.maxFileSize)
    };

    const _errors = [];

    if (!validType.valid) {
      _errors.push(validType.message);
    }

    if (!validSize.valid) {
      _errors.push(validSize.message);
    }

    return {
      valid: validType.valid && validSize.valid,
      errors: _errors
    };
  }

  validateFileSize(media: File, maxFileSize): boolean {
    return media.size < maxFileSize;
  }

  validateDoc(media: File, validTypes = this.validFileTypes): boolean {
    return validTypes.includes(media.type);
  }

  validateImage(media: File, validTypes = this.validImageTypes): boolean {
    return validTypes.includes(media.type);
  }

  uploadImage(media: File) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    return this.uploadFile(media, url);
  }

  uploadFile(media: File, url: string = this.imageUploadUrl, customHeaders?: HttpHeaders) {
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    const formData: FormData = new FormData();

    formData.append('tz', this.session.tz);
    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers: customHeaders ? customHeaders : headers }).pipe(
      catchError((err) => {
        if (err.status === 403) {
          CPLogger.log(`Failed to upload ${media.name} ${media.size}`);
        }
        return throwError(err);
      })
    );
  }
}
