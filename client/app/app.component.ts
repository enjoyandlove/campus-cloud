import { Component, OnInit } from '@angular/core';
import * as Raven from 'raven-js';

import { ENV as environment } from './config/env';

import '../style/app.scss';

@Component({
  selector: 'cp-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ravenInit() {
    Raven.setTagsContext({
      environment,
    });
  }
  ngOnInit() {
    this.ravenInit();
  }
}
