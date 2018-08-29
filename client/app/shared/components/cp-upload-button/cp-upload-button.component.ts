import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cp-upload-button',
  templateUrl: './cp-upload-button.component.html',
  styleUrls: ['./cp-upload-button.component.scss']
})
export class CPUploadButtonComponent implements OnInit {
  @Input() id = 'upload_button';
  @Input() theme: string;
  @Input() isRequired: boolean;
  @Input() buttonText: string;
  @Input() buttonClass: string;
  @Output() fileUpload: EventEmitter<File> = new EventEmitter();
  @Input() props: any;

  constructor() {}

  onChange(event) {
    this.fileUpload.emit(event.target.files[0]);

    // chrome wont trigger change event if
    // you upload same file unless we clear it
    event.target.value = null;
  }

  ngOnInit() {}
}
