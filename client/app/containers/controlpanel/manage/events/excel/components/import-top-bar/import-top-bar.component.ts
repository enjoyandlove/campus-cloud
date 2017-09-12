import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../../../../../config/api';
import { EventsService } from '../../../events.service';
import { CPImage, appStorage } from '../../../../../../../shared/utils';
import { FileUploadService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class EventsImportTopBarComponent implements OnInit {
  @Input() storeId: number;

  @Input() clubId: number;
  @Input() isClub: boolean;

  @Input() serviceId: number;
  @Input() isService: boolean;

  @Output() bulkChange: EventEmitter<any> = new EventEmitter();
  // @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() hostChange: EventEmitter<number> = new EventEmitter();
  @Output() imageChange: EventEmitter<string> = new EventEmitter();

  // stores;
  imageError;

  constructor(
    // private storeService: StoreService,
    private eventService: EventsService,
    private fileUploadService: FileUploadService
  ) { }

  onFileUpload(file) {
    this.imageError = null;
    const fileExtension = file.name.split('.').pop();

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.imageError = 'File too Big';
      return;
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.imageError = 'Invalid Extension';
      return;
    }

    const headers = new Headers();
    const url = this.eventService.getUploadImageUrl();
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => {
        this.imageChange.emit(res.image_url);
      },
      err => console.error(err)
      );
  }

  ngOnInit() { }
}
