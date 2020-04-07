import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'ready-ui-gallery-add-item',
  templateUrl: './gallery-add-item.component.html',
  styleUrls: ['./gallery-add-item.component.scss']
})
export class GalleryAddItemComponent implements OnInit {
  @Input()
  maxFileSize = 5e6;

  @Output()
  add: EventEmitter<File[]> = new EventEmitter();

  @Output()
  error: EventEmitter<{ file: File }> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onChange({ target: { files } }) {
    files = Array.from(files).filter((file: File) =>
      this.validateSize(file) ? file : this.emitError(file)
    );
    if (files.length) {
      this.add.emit(files);
    }
  }

  validateSize(file: File) {
    return file.size <= this.maxFileSize;
  }

  getLocalUrl(file: File) {
    return URL.createObjectURL(file);
  }

  emitError(file: File) {
    this.error.emit({ file });
  }
}