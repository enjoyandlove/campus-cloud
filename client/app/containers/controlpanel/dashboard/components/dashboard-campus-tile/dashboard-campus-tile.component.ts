import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DashboardService } from './../../dashboard.service';
import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { environment } from './../../../../../../environments/environment';

@Component({
  selector: 'cp-dashboard-campus-tile',
  templateUrl: './dashboard-campus-tile.component.html',
  styleUrls: ['./dashboard-campus-tile.component.scss']
})
export class DashboardCampuTileComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  items = [];
  defaultImage = `${environment.root}public/default/user.png`;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(private session: CPSession, private service: DashboardService) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }

  fetch() {
    const search = new HttpParams()
      .set('end', this._dates.end)
      .set('start', this._dates.start)
      .set('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getCampusTile(search);

    super.fetchData(stream$).then((res) => (this.items = res.data));
  }

  ngOnInit() {}
}
