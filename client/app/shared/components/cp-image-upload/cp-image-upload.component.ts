import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-image-upload',
  templateUrl: './cp-image-upload.component.html',
  styleUrls: ['./cp-image-upload.component.scss']
})
export class CPImageUploadComponent implements OnInit {
  fileName;

  constructor() {
  }

  onFileChange(event) {
    this.fileName = event.target.files[0].name;
    // console.log(event.target.files[0]);
  }

  ngOnInit() { }
}
