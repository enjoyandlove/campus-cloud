import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IModal, MODAL_DATA } from '@shared/services';

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
    const categoryId = this.modal.data.id;

    this.store.dispatch(new fromStore.DeleteCategories({ categoryId }));
    this.resetModal();
  }

  resetModal() {
    this.modal.onClose();
  }

  ngOnInit(): void {}
}
