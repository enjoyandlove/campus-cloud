import { Component, OnInit } from '@angular/core';

import { isProd } from '../../../config/env';

declare var window: any;

@Component({
  selector: 'cp-intercomm',
  templateUrl: './cp-intercomm.component.html',
})
export class CPIntercommComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    if (isProd) {
      setTimeout(() => {
        window.Intercom('boot', {
          app_id: 'v0k6hr06'
        });
      }, 2000);
    }
  }
}
