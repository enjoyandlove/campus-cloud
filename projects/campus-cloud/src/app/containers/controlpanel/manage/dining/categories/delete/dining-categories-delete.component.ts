import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { IModal, MODAL_DATA } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-dining-categories-delete',
  templateUrl: './dining-categories-delete.component.html',
  styleUrls: ['./dining-categories-delete.component.scss']
})
export class DiningCategoriesDeleteComponent implements OnInit {
  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    public store: Store<fromStore.ICategoriesState>
  ) {}

  onDelete() {
    this.store.dispatch(new fromStore.DeleteCategories(this.modal.data));
    this.resetModal();
  }

  resetModal() {
    this.modal.onClose();
  }

  ngOnInit(): void {}
}
