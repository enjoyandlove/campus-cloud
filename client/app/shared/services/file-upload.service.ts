import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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
    const isValid = media.size < this.maxFileSize;
    return isValid ? Observable.of(media) : Observable.throw('File is too big');
  }

  validateDoc(media: File, validTypes = this.validFileTypes) {
    const isValid = validTypes.includes(media.type);
    return isValid ? Observable.of(media) : Observable.throw('Invalid file type');
  }

  validateImage(media: File, validTypes = this.validImageTypes) {
    const isValid = validTypes.includes(media.type);
    return isValid ? Observable.of(media) : Observable.throw('Invalid file type');
  }

  uploadFile(media: File, url: string, headers?: Headers) {
    let formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers }).map(res => res.json());
  }
}
