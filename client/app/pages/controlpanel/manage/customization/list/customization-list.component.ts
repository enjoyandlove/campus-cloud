import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-customization-list',
  templateUrl: './customization-list.component.html',
  styleUrls: ['./customization-list.component.scss']
})
export class CustomizationListComponent implements OnInit {
  error;
  image;
  isError;

  constructor() { }

  onError(error) {
    this.isError = true;
    this.error = error;
  }

  onReset() {
    this.isError = false;
    this.error = null;
  }

  onUpload(image) {
    this.image = image;
  }

  ngOnInit() { }
}
