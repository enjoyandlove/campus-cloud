import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { MODAL_TYPE } from './../cp-modal/cp-modal.component';

@Component({
  selector: 'cp-lightbox',
  templateUrl: './cp-lightbox.component.html',
  styleUrls: ['./cp-lightbox.component.scss']
})
export class CPLightboxComponent implements OnInit, AfterViewInit {
  @Input() lightboxId: string;
  @Input() images: string[];
  @Input() index: number;

  @Output() lightboxClose: EventEmitter<null> = new EventEmitter();

  modalWide = MODAL_TYPE.WIDE;

  flip(i: number) {
    this.index += i;
    if (this.index < 0) {
      this.index = this.images.length - 1;
    }
    if (this.index > this.images.length - 1) {
      this.index = 0;
    }
  }

  onModalClose() {
    this.lightboxClose.emit();
  }

  onClose() {
    $(`#${this.lightboxId}`).modal('hide');
  }

  ngAfterViewInit() {
    $(`#${this.lightboxId}`).modal();
  }

  ngOnInit() {}
}
