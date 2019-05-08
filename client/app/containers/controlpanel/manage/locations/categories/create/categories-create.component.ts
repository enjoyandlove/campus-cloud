import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import {
  categoryTypes,
  CategoryModel,
  LocationCategoryLocale
} from '@libs/locations/common/categories/model';

@Component({
  selector: 'cp-categories-create',
  templateUrl: './categories-create.component.html',
  styleUrls: ['./categories-create.component.scss']
})
export class CategoriesCreateComponent implements OnInit, OnDestroy {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formError;
  form: FormGroup = CategoryModel.form();
  categoryIcons = CategoryModel.categoryIcons();
  categoryTypes: IItem[] = this.locationUtils
    .getLocationTypes()
    .filter((l: IItem) => l.action !== categoryTypes.dining);

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private locationUtils: LocationsUtilsService,
    public store: Store<fromStore.ICategoriesState>
  ) {}

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  get defaultParams(): HttpParams {
    const locale = CPI18nService.getLocale().startsWith('fr')
      ? LocationCategoryLocale.fr
      : LocationCategoryLocale.eng;

    return new HttpParams().set('locale', locale).set('school_id', this.session.g.get('school').id);
  }

  doSubmit() {
    this.formError = false;

    if (!this.form.valid) {
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

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
