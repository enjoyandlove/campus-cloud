import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events-facebook',
  templateUrl: './clubs-events-facebook.component.html'
})
export class ClubsEventsFacebookComponent implements OnInit {
  clubId;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
