import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { CPI18nService } from './index';

@Injectable()
export class FileUploadService {
  maxFileSize = 5e6; // 5MB

  validFileTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(private http: Http, private cpI18n: CPI18nService) {}

  validImage(file: File): { valid: boolean; errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateImage(file),
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file),
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
      errors,
    };
  }

  validFile(file: File): { valid: boolean; errors: Array<string> } {
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
      errors: [validType.message, validSize.message],
    };
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
    const formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers }).map((res) => res.json());
  }
}
