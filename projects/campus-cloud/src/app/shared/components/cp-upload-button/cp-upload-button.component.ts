import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

let nextUniqueId = 0;

@Component({
  selector: 'cp-upload-button',
  templateUrl: './cp-upload-button.component.html',
  styleUrls: ['./cp-upload-button.component.scss']
})
export class CPUploadButtonComponent implements OnInit {
  @Input() props: any;
  @Input() busy: boolean;
  @Input() theme: string;
  @Input() isRequired: boolean;
  @Input() buttonText: string;
  @Input() buttonClass: string;

  @Output() fileUpload: EventEmitter<File> = new EventEmitter();

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  protected _id = `cp-upload-button-${nextUniqueId++}`;

  protected _uid = `cp-upload-button-${nextUniqueId++}`;

  constructor() {}

  onChange(event) {
    this.fileUpload.emit(event.target.files[0]);

    // chrome wont trigger change event if
    // you upload same file unless we clear it
    event.target.value = null;
  }

  ngOnInit() {}
}
