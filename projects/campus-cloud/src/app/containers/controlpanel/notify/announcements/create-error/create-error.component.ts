import { Component, Inject } from '@angular/core';

import { MODAL_DATA, IModal } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-announcement-create-error',
  templateUrl: './create-error.component.html',
  styleUrls: ['./create-error.component.scss']
})
export class AnnouncementCreateErrorComponent {
  constructor(@Inject(MODAL_DATA) private data: IModal) {}

  onClose() {
    this.data.onClose();
  }

  onSendNow() {
    this.data.onAction();
    this.data.onClose();
  }

  onGoBack() {
    this.data.onClose();
  }
}
