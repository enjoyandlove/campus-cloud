import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-banner-upload',
  templateUrl: './banner-upload.component.html',
  styleUrls: ['./banner-upload.component.scss']
})
export class BannerUploadComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isEdit: boolean;
  @Input() uploading: boolean;

  @Output() onCrop: EventEmitter<null> = new EventEmitter();
  @Output() onReset: EventEmitter<null> = new EventEmitter();
  @Output() onUpload: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
