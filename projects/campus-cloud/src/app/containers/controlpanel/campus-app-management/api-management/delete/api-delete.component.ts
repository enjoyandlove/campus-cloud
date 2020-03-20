import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { IAPIManagementState } from '../model';
import { IModal, MODAL_DATA } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-api-delete',
  templateUrl: './api-delete.component.html',
  styleUrls: ['./api-delete.component.scss']
})
export class ApiDeleteComponent implements OnInit {
  constructor(@Inject(MODAL_DATA) public modal: IModal, public store: Store<IAPIManagementState>) {}

  onDelete() {
    this.store.dispatch(fromStore.deleteRequest({ payload: this.modal.data }));
    this.resetModal();
  }

  resetModal() {
    this.modal.onClose();
  }

  ngOnInit(): void {}
}
