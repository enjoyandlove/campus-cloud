import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';


@Injectable()
export class FileUploadService {
  constructor(private http: Http) { }

  uploadFile(media: File, url: string, headers?: Headers) {
    let formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers }).map(res => res.json());
  }
}
