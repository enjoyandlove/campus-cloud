import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-athletics-events-create',
  template: `<cp-clubs-events-create
              [isAthletic]="isAthletic">
             </cp-clubs-events-create>`
})
export class AthleticsEventsCreateComponent implements OnInit {
  isAthletic = true;

  constructor() {}

  ngOnInit() {}
}
