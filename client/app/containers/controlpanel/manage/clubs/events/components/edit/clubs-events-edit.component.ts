import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-events-edit',
  templateUrl: './clubs-events-edit.component.html',
})
export class ClubsEventEditComponent implements OnInit {
  clubId;
  isClub = true;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.clubId = this.route.snapshot.parent.parent.params['clubId'];
  }
}
