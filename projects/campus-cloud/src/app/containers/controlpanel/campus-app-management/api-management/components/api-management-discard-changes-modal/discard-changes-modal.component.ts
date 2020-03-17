import { OnInit, Component, Inject } from '@angular/core';

import { IModal, MODAL_DATA } from '@campus-cloud/shared/services';
import { ApiManagementUtilsService } from '../../api-management.utils.service';

@Component({
  selector: 'cp-discard-changes-modal',
  templateUrl: './discard-changes-modal.component.html',
  styleUrls: ['./discard-changes-modal.component.scss']
})
export class DiscardChangesModalComponent implements OnInit {
  constructor(@Inject(MODAL_DATA) public modal: IModal, public utils: ApiManagementUtilsService) {}

  onDiscardChanges(value) {
    this.utils.navigateAwaySelection$.next(value);
    this.modal.onClose();
  }

  ngOnInit() {}
}
