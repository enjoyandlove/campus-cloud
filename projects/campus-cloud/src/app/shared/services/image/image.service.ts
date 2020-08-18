import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { CPLogger } from '../logger';
import { ApiService } from '@campus-cloud/base/services';
import { ImageValidatorService } from './image.validator.service';

@Injectable()
export class ImageService {
  private readonly apiImageUrl = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private validator: ImageValidatorService
  ) {}

  getHeaders() {
    return new HttpHeaders({
      Authorization: this.api.token
    });
  }

  uploadBase64(base64ImageData: string) {
    const body = {
      base64_image: base64ImageData
    };

    const headers = this.getHeaders();

    return this.http.post(this.apiImageUrl, body, { headers });
  }

  upload(file: File, url = this.apiImageUrl) {
    if (!file) {
      return throwError(new Error('No File'));
    }

    const errors = this.validator.validate(file);

    if (errors) {
      return throwError(new Error(errors.join(', ')));
    }

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = this.getHeaders();

    return this.http.post(url, formData, { headers }).pipe(
      catchError((err) => {
        if (err.status === 403) {
          CPLogger.log(`Failed to upload ${file.name} ${file.size}`);
        }
        return throwError(err);
      })
    );
  }

  getValidFilesAndErrors(files: File[]): {validFiles: File[], errors?: string[]} {
    const errors: string[] = [];
    const validFiles = Array.from(files).filter((file: File) => {
        const currentFileErrors = this.validator.validate(file);
        if (currentFileErrors) {
          currentFileErrors.forEach(value => errors.push(value));
        } else {
          return file;
        }
      }
    );

    return {validFiles, errors};
  }
}
