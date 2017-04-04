import { Component, OnInit } from '@angular/core';

import { MembersService } from '../members.service';
import { BaseComponent } from '../../../../../../base/base.component';

@Component({
  selector: 'cp-clubs-members',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ClubsMembersComponent extends BaseComponent implements OnInit {
  members;
  loading;

  constructor(
    private membersService: MembersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.membersService.getMembers())
      .then(res => this.members = res.data)
      .catch(err => console.log(err));
  }

  ngOnInit() { }
}
