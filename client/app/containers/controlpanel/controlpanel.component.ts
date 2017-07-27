import { Component, OnInit } from '@angular/core';

import { isProd } from '../../config/env';

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent implements OnInit {
  isProd = isProd;
  snackbarContent;

  constructor() { }

  ngOnInit() {
    this.snackbarContent = {
      body: 'Your message has been sent!'
    };
  }

}
