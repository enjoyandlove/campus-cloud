import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { ClubStatus } from '../club.status';

@Component({
  selector: 'cp-clubs-info',
  templateUrl: './clubs-info.component.html',
  styleUrls: ['./clubs-info.component.scss']
})
export class ClubsInfoComponent extends BaseComponent implements OnInit {
  club;
  loading;
  clubStatus;
  clubId: number;
  hasMetaData = false;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private session: CPSession,
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();
    this.clubId = this.route.parent.snapshot.params['clubId'];

    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.clubsService.getClubById(this.clubId, search))
      .then(res => {
        this.club = res.data;
        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data.latitude,
            lng: res.data.longitude
          }
        );
        this.hasMetaData = this.club.contactphone ||
          this.club.email ||
          this.club.room_info ||
          this.club.location ||
          this.club.website ||
          this.club.address ||
          this.club.constitution_url ||
          this.club.advisor_firstname ||
          this.club.advisor_lastname ||
          this.club.advisor_email;
      })
      .catch(err => { throw new Error(err) });
  }

  ngOnInit() {
    this.clubStatus = {
      [ClubStatus.inactive] : 'Inactive',
      [ClubStatus.active] : 'Active',
      [ClubStatus.pending] : 'Pending'
    };
  }
}
