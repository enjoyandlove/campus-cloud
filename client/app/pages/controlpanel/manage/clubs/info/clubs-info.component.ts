import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClubsService } from '../clubs.service';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-clubs-info',
  templateUrl: './clubs-info.component.html',
  styleUrls: ['./clubs-info.component.scss']
})
export class ClubsInfoComponent extends BaseComponent implements OnInit {
  club;
  loading;
  clubId: number;

  constructor(
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();
    this.clubId = this.route.parent.snapshot.params['clubId'];

    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.clubsService.getClubsbyId(this.clubId))
      .then(res => {
        this.club = res.data;
      })
      .catch(err => console.log(err));
  }

  ngOnInit() { }
}
