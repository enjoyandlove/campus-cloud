import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events-facebook',
  templateUrl: './clubs-events-facebook.component.html'
})
export class ClubsEventsFacebookComponent implements OnInit {
  @Input() isAthletic;

  clubId;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
