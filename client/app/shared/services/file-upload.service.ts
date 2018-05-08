import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CPI18nService } from './index';

@Injectable()
export class FileUploadService {
  maxImageSize = 8e6; // 5MB
  maxFileSize = 8e6; // 8MB

  validFileTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  constructor(private http: HttpClient, private cpI18n: CPI18nService) {}

  validImage(file: File): { valid: boolean; errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateImage(file)
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file, this.maxImageSize)
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

  uploadFile(media: File, url: string, headers?: HttpHeaders) {
    const formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers }).map((res) => res);
  }
}
