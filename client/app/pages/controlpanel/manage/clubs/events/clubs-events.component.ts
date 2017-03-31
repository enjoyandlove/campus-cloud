import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events',
  templateUrl: './clubs-events.component.html',
  styleUrls: ['./clubs-events.component.scss']
})
export class ClubsEventsComponent implements OnInit {
  clubId: number;

  constructor(
    private route: ActivatedRoute
  ) {
    this.clubId = this.route.snapshot.params['clubId'];
  }

  ngOnInit() { }
}
