import { Component, OnInit } from '@angular/core';

declare var window: any;

@Component({
  selector: 'cp-intercomm',
  templateUrl: './cp-intercomm.component.html',
})
export class CPIntercommComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    window.Intercom('boot', {
      app_id: 'v0k6hr06'
    });
  }
}
