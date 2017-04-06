import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../base';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent extends BaseComponent implements OnInit {
  status;
  privileges;
  loading = true;

  constructor(
    private store: Store<any>,
  ) {
    super();

    super.isLoading().subscribe(res => this.loading = res);

    this.status = this.store.select('MOBILE');
  }

  ngOnInit() { }
}
