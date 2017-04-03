import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-clubs-wall',
  templateUrl: './clubs-wall.component.html',
  styleUrls: ['./clubs-wall.component.scss']
})
export class ClubsWallComponent implements OnInit {
  clubId: number;

  constructor(
    private route: ActivatedRoute
  ) {
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }


  ngOnInit() {
  }
}
