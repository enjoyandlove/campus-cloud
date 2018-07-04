import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-wall',
  templateUrl: './clubs-wall.component.html'
})
export class ClubsWallComponent implements OnInit {
  @Input() athleticId: number;

  clubId: number;
  isClubsView = true;

  constructor(private route: ActivatedRoute) {
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }

  ngOnInit() {}
}
