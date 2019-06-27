import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { IStore } from '../store.interface';
import * as fromDeals from '@campus-cloud/store/manage/deals';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';

@Component({
  selector: 'cp-store-edit',
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss']
})
export class StoreEditComponent implements OnInit, OnDestroy {
  @Input() store: IStore;

  @Output() edited: EventEmitter<IStore> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  error;
  buttonData;
  errorMessage;
  storeForm: FormGroup;
  destroy$ = new Subject();

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public updates$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public stateStore: Store<fromDeals.IDealsState>
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetEditModal.emit();
    $('#editModal').modal('hide');
  }

  onSubmit() {
    this.error = false;
    this.stateStore.dispatch(new fromDeals.EditStore(this.storeForm.value));
  }

  ngOnInit() {
    this.storeForm = this.fb.group({
      id: [this.store.id],
      name: [this.store.name, [Validators.required, Validators.maxLength(120)]],
      description: [this.store.description],
      logo_url: [this.store.logo_url, Validators.required],
      city: [this.store.city],
      address: [this.store.address],
      province: [this.store.province],
      country: [this.store.country],
      postal_code: [this.store.postal_code],
      website: [this.store.website],
      latitude: [this.store.latitude],
      longitude: [this.store.longitude]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    });

    this.storeForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.storeForm.valid };
    });

    this.updates$
      .pipe(
        ofType(fromDeals.EDIT_STORE_SUCCESS || fromDeals.EDIT_STORE_FAIL),
        takeUntil(this.destroy$)
      )
      .subscribe((action: any) => {
        if (action instanceof fromDeals.EditStoreSuccess) {
          this.edited.emit(action.payload);
          this.resetModal();
        } else if (action instanceof fromDeals.EditStoreFail) {
          this.error = true;
          this.errorMessage = this.cpI18n.translate('something_went_wrong');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
