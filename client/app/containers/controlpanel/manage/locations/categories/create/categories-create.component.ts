import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CategoryModel } from '../model';
import { IItem } from '@shared/components';
import { Locale } from '../categories.status';
import { CPI18nService } from '@shared/services';

@Component({
  selector: 'cp-categories-create',
  templateUrl: './categories-create.component.html',
  styleUrls: ['./categories-create.component.scss']
})
export class CategoriesCreateComponent implements OnInit, OnDestroy {
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formError;
  form: FormGroup;
  categoryTypes$: Observable<IItem[]>;

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
    const locale = CPI18nService.getLocale().startsWith('fr') ? Locale.fr : Locale.eng;

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

  ngOnInit(): void {
    this.form = CategoryModel.form();
    this.categoryTypes$ = this.store.select(fromStore.getCategoriesType);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
