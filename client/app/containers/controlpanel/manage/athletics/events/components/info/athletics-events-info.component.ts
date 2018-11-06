import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-athletics-events-info',
  template: `<cp-clubs-events-info
              [isAthletic]="isAthletic">
             </cp-clubs-events-info>`
})
export class AthleticsEventsInfoComponent implements OnInit {
  isAthletic = true;

  constructor() {}

  ngOnInit() {}
}
