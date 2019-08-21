import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Actions, ofType } from '@ngrx/effects';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../../store';
import * as fromActions from '../../store/actions';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { ModalService } from '@campus-cloud/shared/services';
import { ApiDeleteComponent } from '@controlpanel/api-management/delete';
import { DiscardChangesModalComponent } from '@controlpanel/api-management/components';
import { IAPIManagementState, IPublicApiAccessToken } from '@controlpanel/api-management/model';
import { ApiManagementUtilsService } from '@controlpanel/api-management/api-management.utils.service';

@Component({
  selector: 'cp-api-list-item',
  templateUrl: './api-list-item.component.html',
  styleUrls: ['./api-list-item.component.scss'],
  providers: [ModalService]
})
export class ApiListItemComponent implements OnInit {
  isEdit = false;
  modal: OverlayRef;
  formDirty = false;
  widgetIndex: number;
  discardModal: OverlayRef;
  dateFormat = FORMAT.SHORT;
  loading$: Observable<boolean>;
  item$: Observable<IPublicApiAccessToken>;

  @Input() items$: Observable<IPublicApiAccessToken[]>;

  @Output() formStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private action$: Actions,
    private modalService: ModalService,
    private utils: ApiManagementUtilsService,
    public store: Store<IAPIManagementState>
  ) {}

  trackByFn(_, item) {
    return item.id;
  }

  onValueChanges(form: FormGroup) {
    this.formDirty = form.dirty;

    this.formStatus.emit(form.dirty);
  }

  showDiscardModal() {
    this.discardModal = this.modalService.open(
      DiscardChangesModalComponent,
      {},
      { onClose: this.resetDiscardModal.bind(this) }
    );

    return this.utils.navigateAwaySelection$;
  }

  revokeAccessToken(accessToken: IPublicApiAccessToken) {
    if (this.isEdit && this.formDirty) {
      return this.showDiscardModal()
        .pipe(take(1))
        .subscribe((canNavigate: boolean) => {
          if (!canNavigate) {
            return;
          }

          this.showDeleteModal(accessToken);

          return;
        });
    }

    this.showDeleteModal(accessToken);
  }

  showDeleteModal(accessToken) {
    this.hideEditWidget();
    this.modal = this.modalService.open(
      ApiDeleteComponent,
      {},
      {
        data: accessToken,
        onClose: this.resetModal.bind(this)
      }
    );
  }

  resetModal() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  resetDiscardModal() {
    this.modalService.close(this.discardModal);
    this.discardModal = null;
  }

  hideEditWidget() {
    this.isEdit = false;
    this.formDirty = false;
    this.widgetIndex = null;
    this.formStatus.emit(this.formDirty);
  }

  onShowEditWidget(index, tokenId) {
    if (this.isEdit && this.formDirty) {
      return this.showDiscardModal()
        .pipe(take(1))
        .subscribe((canNavigate: boolean) => {
          if (!canNavigate) {
            return;
          }

          this.loadEditWidget(index, tokenId);

          return;
        });
    }

    this.loadEditWidget(index, tokenId);
  }

  loadEditWidget(index, tokenId) {
    this.isEdit = true;
    this.formDirty = false;
    this.widgetIndex = index;
    this.formStatus.emit(this.formDirty);

    this.store.dispatch(fromActions.loadRequestById({ tokenId }));

    this.loading$ = this.store.select(fromStore.getTokenByIdLoading);
    this.item$ = this.store.select(fromStore.getTokenById);
  }

  onFormSubmitted(tokenId, body) {
    const payload = { tokenId, body };

    this.store.dispatch(fromActions.editRequest({ payload }));

    this.action$.pipe(ofType(fromActions.editSuccess)).subscribe((action) => {
      if (action.data) {
        this.hideEditWidget();
      }
    });
  }

  ngOnInit() {}
}
