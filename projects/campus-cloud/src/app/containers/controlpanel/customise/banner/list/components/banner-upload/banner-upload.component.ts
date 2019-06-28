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

  @Output() crop: EventEmitter<null> = new EventEmitter();
  @Output() upload: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() resetClick: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
