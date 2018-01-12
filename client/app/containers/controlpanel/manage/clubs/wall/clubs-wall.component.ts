import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-wall',
  templateUrl: './clubs-wall.component.html'
})
export class ClubsWallComponent implements OnInit {
  clubId: number;
  isClubsView = true;
  customCSS = true;

  constructor(
    private route: ActivatedRoute
  ) {
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }

  ngOnInit() { }
}
