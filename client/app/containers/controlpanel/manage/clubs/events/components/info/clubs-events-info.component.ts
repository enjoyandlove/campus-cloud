import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events-info.component',
  templateUrl: './clubs-events-info.component.html',
})
export class ClubsEventInfoComponent implements OnInit {
  clubId;
  isClub = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
