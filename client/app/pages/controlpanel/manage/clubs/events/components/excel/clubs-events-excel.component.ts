import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events-excel',
  templateUrl: './clubs-events-excel.component.html',
})
export class ClubsEventsExcelComponent implements OnInit {
  clubId;
  isClub = true;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
