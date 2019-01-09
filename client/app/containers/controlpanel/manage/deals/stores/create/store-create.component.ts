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
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';

import { CPSession } from '@app/session';
import { IStore } from '../store.interface';
import * as fromDeals from '@app/store/manage/deals';
import { CPI18nService } from '@shared/services/i18n.service';

@Component({
  selector: 'cp-store-create',
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit, OnDestroy {
  @Output() created: EventEmitter<IStore> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  errorMessage;
  error = false;
  storeForm: FormGroup;
  destroy$ = new Subject();

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public updates$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromDeals.IDealsState>
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetCreateModal.emit();
    $('#createModal').modal('hide');
  }

  onSubmit() {
    this.error = false;
    this.store.dispatch(new fromDeals.CreateStore(this.storeForm.value));
  }

  ngOnInit() {
    this.storeForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(120)]],
      logo_url: [null, Validators.required],
      description: [null],
      website: [null],
      address: [null],
      city: [null],
      province: [null],
      country: [null],
      postal_code: [null],
      latitude: [0],
      longitude: [0]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    });

    this.storeForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.storeForm.valid };
    });

    this.updates$
      .pipe(
        ofType(fromDeals.CREATE_STORE_SUCCESS || fromDeals.CREATE_STORE_FAIL),
        takeUntil(this.destroy$)
      )
      .subscribe((action: any) => {
        if (action instanceof fromDeals.CreateStoreSuccess) {
          this.created.emit(action.payload);
          this.resetModal();
        } else if (action instanceof fromDeals.CreateStoreFail) {
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
