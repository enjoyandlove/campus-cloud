import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { baseActions, IAlert, getAlertState } from '../../../store/base';

@Component({
  selector: 'cp-alert',
  templateUrl: './cp-alert.component.html',
  styleUrls: ['./cp-alert.component.scss']
})
export class CPAlertComponent implements OnInit {
  message: IAlert;

  constructor(private store: Store<any>) {
    this.store.select(getAlertState).subscribe((res: IAlert) => {
      this.message = res;
    });
  }

  onClose() {
    this.store.dispatch({ type: baseActions.ALERT_DEFAULT });
  }

  ngOnInit() {}
}
