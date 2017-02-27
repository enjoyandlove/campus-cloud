import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-upload-button',
  templateUrl: './cp-upload-button.component.html',
  styleUrls: ['./cp-upload-button.component.scss']
})
export class CPUploadButtonComponent implements OnInit {
  @Input() buttonClass: string;
  @Output() fileUpload: EventEmitter<File> = new EventEmitter();

  constructor() { }

  onChange(file) {
    this.fileUpload.emit(file.target.files[0]);
  }

  ngOnInit() { }
}
