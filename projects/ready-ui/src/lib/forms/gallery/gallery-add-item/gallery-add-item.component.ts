import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ready-ui-gallery-add-item',
  templateUrl: './gallery-add-item.component.html',
  styleUrls: ['./gallery-add-item.component.scss']
})
export class GalleryAddItemComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  @Output()
  add: EventEmitter<File[]> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onChange({ target: { files } }) {
    if (files.length) {
      this.add.emit(files);
    }

    // Clear the existing selection so that the change handler will be invoked even if the same file is selected again.
    this.fileInput.nativeElement.value = '';
  }
}
