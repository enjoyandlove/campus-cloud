import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events-create',
  templateUrl: './clubs-events-create.component.html'
})
export class ClubsEventsCreateComponent implements OnInit {
  @Input() isAthletic;

  clubId;
  isClub = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
