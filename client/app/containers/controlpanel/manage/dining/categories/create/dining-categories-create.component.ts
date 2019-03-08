import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { Destroyable, Mixin } from '@shared/mixins';
import { CPI18nService, IModal, MODAL_DATA } from '@shared/services';
import { CategoryModel } from '@libs/locations/common/categories/model';
import { LocationCategoryLocale } from '@libs/locations/common/categories/categories.status';

@Component({
  selector: 'cp-dining-categories-create',
  templateUrl: './dining-categories-create.component.html',
  styleUrls: ['./dining-categories-create.component.scss']
})
@Mixin([Destroyable])
export class DiningCategoriesCreateComponent implements OnInit, OnDestroy {
  formError;
  form: FormGroup;
  categoryTypes$: Observable<IItem[]>;
  categoryIcons = CategoryModel.diningCategoryIcons();

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    @Inject(MODAL_DATA) private modal: IModal,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.ICategoriesState>
  ) {}

  resetModal() {
    this.modal.onClose();
  }

  get defaultParams(): HttpParams {
    const locale = CPI18nService.getLocale().startsWith('fr')
      ? LocationCategoryLocale.fr
      : LocationCategoryLocale.eng;

    return new HttpParams().set('locale', locale).set('school_id', this.session.g.get('school').id);
  }

  doSubmit() {
    this.formError = false;

    if (this.form.invalid) {
      this.formError = true;

      return;
    }

    const body = this.form.value;
    const params = this.defaultParams;

    const payload = {
      body,
      params
    };

    this.store.dispatch(new fromStore.PostCategory(payload));

    this.resetModal();
  }

  ngOnInit(): void {
    this.form = CategoryModel.form();

    this.categoryTypes$ = this.store
      .select(fromStore.getCategoriesType)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
