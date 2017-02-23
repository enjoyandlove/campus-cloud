import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class FileUploadService {
  constructor(private http: Http) { }

  uploadFile(media: File, url: string) {
    let formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData).map(res => res.json());
  }
}
