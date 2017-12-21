import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { CPI18nService } from './index';

@Injectable()
export class FileUploadService {
  maxFileSize = 8e+7;

  validFileTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(
    private http: Http,
    private cpI18n: CPI18nService
  ) { }

  validImage(file: File): { valid: boolean, errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateImage(file),
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file),
    };

    return {
      valid: validType.valid && validSize.valid,
      errors: [validType.message, validSize.message]
    }
  }

  validFile(file: File): { valid: boolean, errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateDoc(file),
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file),
    };

    return {
      valid: validType.valid && validSize.valid,
      errors: [validType.message, validSize.message]
    }
  }

  validateFileSize(media: File): boolean {
    return media.size < this.maxFileSize;
  }

  validateDoc(media: File, validTypes = this.validFileTypes): boolean {
    return validTypes.includes(media.type);
  }

  validateImage(media: File, validTypes = this.validImageTypes): boolean {
    return validTypes.includes(media.type);
  }

  uploadFile(media: File, url: string, headers?: Headers) {
    let formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers }).map(res => res.json());
  }
}
