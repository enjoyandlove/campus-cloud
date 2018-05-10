import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ALERT_DEFAULT, IAlert } from '../../../reducers/alert.reducer';

@Component({
  selector: 'cp-alert',
  templateUrl: './cp-alert.component.html',
  styleUrls: ['./cp-alert.component.scss']
})
export class CPAlertComponent implements OnInit {
  message: IAlert;

  constructor(private store: Store<any>) {
    this.store.select('ALERT').subscribe((res: IAlert) => {
      this.message = res;
    });
  }

  onClose() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() {}
}
