import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import { IItem } from '@campus-cloud/shared/components';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { categoryTypes, CategoryModel } from '@campus-cloud/libs/locations/common/categories/model';

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
    private locationUtils: LocationsUtilsService,
    public store: Store<fromStore.ICategoriesState>
  ) {}

  resetModal() {
    this.form.reset();
    this.teardown.emit();
  }

  doSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;

      return;
    }

    const body = this.form.value;

    const payload = {
      body
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
