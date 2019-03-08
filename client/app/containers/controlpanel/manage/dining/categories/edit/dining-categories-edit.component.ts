import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { Destroyable, Mixin } from '@shared/mixins';
import { CPI18nService, IModal, MODAL_DATA } from '@shared/services';
import { ICategory, CategoryModel } from '@libs/locations/common/categories/model';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dining-categories-edit',
  templateUrl: './dining-categories-edit.component.html',
  styleUrls: ['./dining-categories-edit.component.scss']
})
export class DiningCategoriesEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  selectedCategory;
  formError: boolean;
  category: ICategory;
  categoryTypes$: Observable<IItem[]>;
  categoryIcons = CategoryModel.diningCategoryIcons();

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.ICategoriesState>
  ) {}

  resetModal() {
    this.modal.onClose();
  }

  doSubmit() {
    this.formError = false;

    if (this.form.invalid) {
      this.formError = true;

      return;
    }

    const body = this.form.value;

    const payload = {
      body,
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
    this.category = this.modal.data;
    this.loadCategoryTypes();
    this.form = CategoryModel.form(this.category);
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
