import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ISnackbar, baseActionClass } from '@campus-cloud/store/base';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { IItem } from '@campus-cloud/shared/components';

@Component({
  selector: 'cp-cases-import-top-bar',
  templateUrl: './import-top-bar.component.html',
  styleUrls: ['./import-top-bar.component.scss']
})
export class CasesImportTopBarComponent implements OnInit {
  @Input() isChecked: boolean;
  @Input() caseStatus$: Observable<IItem[]>;
  @Input() statusDropDownStatus: boolean;

  @Output() checkAll: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteCases: EventEmitter<any> = new EventEmitter();
  @Output() statusChange: EventEmitter<number> = new EventEmitter();

  constructor(public cpI18nPipe: CPI18nPipe, public store: Store<ISnackbar>) {}

  errorHandler(body = this.cpI18nPipe.transform('something_went_wrong')) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: body
      })
    );
  }

  ngOnInit() {}
}
