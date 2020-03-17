import { OnInit, Component, Inject } from '@angular/core';

import { IModal, MODAL_DATA } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-publish-terms-modal',
  templateUrl: './publish-terms-modal.component.html',
  styleUrls: ['./publish-terms-modal.component.scss']
})
export class PublishTermsModalComponent implements OnInit {
  constructor(@Inject(MODAL_DATA) public modal: IModal) {}

  doTeardown() {
    this.modal.onClose();
  }

  onConfirm() {
    this.modal.onAction();
    this.modal.onClose();
  }

  ngOnInit() {}
}
