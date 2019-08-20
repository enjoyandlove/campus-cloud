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

  uploadBase64(base64ImageData: string) {
    const body = {
      base64_image: base64ImageData
    };

    return this.http.post(this.apiImageUrl, body);
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

    const headers = new HttpHeaders({
      Authorization: this.api.AUTH_TOKEN
    });

    return this.http.post(url, formData, { headers }).pipe(
      catchError((err) => {
        if (err.status === 403) {
          CPLogger.log(`Failed to upload ${file.name} ${file.size}`);
        }
        return throwError(err);
      })
    );
  }
}
