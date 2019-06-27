import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { IItem } from '@campus-cloud/shared/components';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CPI18nService, IModal, MODAL_DATA } from '@campus-cloud/shared/services';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import {
  ICategory,
  CategoryModel,
  categoryTypes
} from '@campus-cloud/libs/locations/common/categories/model';

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
  categoryTypes: IItem[];
  categoryIcons = CategoryModel.diningCategoryIcons();

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    public cpI18n: CPI18nService,
    private locationUtils: LocationsUtilsService,
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
    this.categoryTypes = this.locationUtils
      .getLocationTypes()
      .filter((l: IItem) => l.action === categoryTypes.dining);

    this.selectedCategory = this.categoryTypes.find(
      (c) => c.action === this.category.category_type_id
    );
  }

  ngOnInit(): void {
    this.category = this.modal.data;
    this.loadCategoryTypes();
    this.form = CategoryModel.form(this.category);
    this.form.get('category_type_id').setValue(categoryTypes.dining);
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
