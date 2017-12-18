import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FileUploadService {
  maxFileSize = 10e+7;

  validFileTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];


  constructor(private http: Http) { }

  validateFileSize(media: File) {
    return media.size < this.maxFileSize;
  }

  validateDoc(media: File, validTypes = this.validFileTypes) {
    return validTypes.includes(media.type);
  }

  validateImage(media: File, validTypes = this.validImageTypes) {
    return validTypes.includes(media.type);
  }

  uploadFile(media: File, url: string, headers?: Headers) {
    let formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers }).map(res => res.json());
  }
}
