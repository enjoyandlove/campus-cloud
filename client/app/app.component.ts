import { Component, OnInit } from '@angular/core';
import * as Raven from 'raven-js';

import { environment } from './../environments/environment';

@Component({
  selector: 'cp-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  ravenInit() {
    Raven.setTagsContext({
      environment: environment.envName
    });
  }
  ngOnInit() {
    this.ravenInit();
  }
}
