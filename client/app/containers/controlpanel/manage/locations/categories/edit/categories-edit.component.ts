import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { CPI18nService } from '@shared/services';
import {
  ICategory,
  CategoryModel,
  LocationCategoryLocale
} from '@libs/locations/common/categories/model';

@Component({
  selector: 'cp-categories-edit',
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss']
})
export class CategoriesEditComponent implements OnInit, OnDestroy {
  @Input() category: ICategory;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formError;
  form: FormGroup;
  selectedCategory;
  categoryTypes$: Observable<IItem[]>;
  categoryIcons = CategoryModel.categoryIcons();

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
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
      params,
      categoryId: this.category.id
    };

    this.store.dispatch(new fromStore.EditCategory(payload));

    this.resetModal();
  }

  loadCategoryTypes() {
    this.categoryTypes$ = this.store.select(fromStore.getCategoriesType).pipe(
      takeUntil(this.destroy$),
      map((categoryTypes) => {
        Promise.resolve().then(() => {
          this.selectedCategory = categoryTypes.find(
            (c) => c.action === this.category.category_type_id
          );
        });

        return categoryTypes;
      })
    );
  }

  ngOnInit(): void {
    this.loadCategoryTypes();
    this.form = CategoryModel.form(this.category);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
