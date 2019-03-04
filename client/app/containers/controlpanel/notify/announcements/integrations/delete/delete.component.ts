import { Component, Inject } from '@angular/core';

import { IAnnoucementsIntegration } from '../model';
import { MODAL_DATA, IModal } from '@shared/services';

@Component({
  selector: 'cp-announcements-integrations-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class AnnouncementsIntegrationDeleteComponent {
  integration: IAnnoucementsIntegration;

  constructor(@Inject(MODAL_DATA) public modal: IModal) {
    this.integration = this.modal.data;
  }

  onDeleteClick() {
    console.log('should delete');
  }

  onCancelClick() {
    this.modal.onClose();
  }
}
