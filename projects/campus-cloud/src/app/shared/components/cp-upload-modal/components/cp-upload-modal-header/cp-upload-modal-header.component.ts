import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-upload-modal-header',
  templateUrl: './cp-upload-modal-header.component.html',
  styleUrls: ['./cp-upload-modal-header.component.scss']
})
export class CPUploadModalHeaderComponent implements OnInit {
  @Output() reset: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
