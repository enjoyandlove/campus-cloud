import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { SNACKBAR_HIDE } from './../../../reducers/snackbar.reducer';
@Component({
  selector: 'cp-snackbar',
  templateUrl: './cp-snackbar.component.html',
  styleUrls: ['./cp-snackbar.component.scss']
})
export class CPSnackBarComponent implements OnDestroy, OnInit {
  snack;

  constructor(
    private store: Store<any>
  ) {
    this
      .store
      .select('SNACKBAR')
      .subscribe((res: any) => {

        this.snack = res;

        if (this.snack.autoClose) {
          setTimeout(() => {
            this.doClose();
          }, this.snack.autoCloseDelay);
        }
      });
  }

  doClose() {
    this.store.dispatch({ type: SNACKBAR_HIDE });
  }

  ngOnDestroy() {
    this.doClose();
  }

  ngOnInit() { }
}
