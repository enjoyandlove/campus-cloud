import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { EngagementService } from './engagement.service';
import { BaseComponent } from '../../../../base/base.component';

declare var $;

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent extends BaseComponent implements OnInit {
  chartData;
  isComposeModal;
  loading;
  messageData;

  filters$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private router: Router,
    private service: EngagementService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  updateUrl(state) {
    this
      .router
      .navigate(
        ['/assess/dashboard'],
        {
          queryParams: {
            'engagement': state.engagement.route_id,
            'for': state.for.route_id,
            'range': state.range.route_id
          }
        }
      );
  }

  onDoFilter(filterState) {
    this.updateUrl(filterState);
    this.fetchChartData(filterState);
    this.filters$.next(filterState);
  }

  buildSearchParam() {

  }

  fetchChartData(filterState) {
    let search = new URLSearchParams();
    search.append('scope', filterState.engagement.data.type);
    search.append('list_id', filterState.for.listId);
    search.append('starts', `${filterState.range.payload.range.start}` );
    search.append('ends', `${filterState.range.payload.range.end}` );

    super
      .fetchData(this.service.getChartData(search))
      .then(res => {
        this.chartData = {
          ...res.data,
          starts: filterState.range.payload.range.start,
          ends: filterState.range.payload.range.end,
        };
       })
      .catch(err => console.log(err));
  }

  onDoCompose(data): void {
    this.messageData = data;
    this.isComposeModal = true;
    setTimeout(() => { $('#composeModal').modal(); }, 1);
  }

  onComposeTeardown() {
    this.isComposeModal = false;
    this.messageData = null;
  }

  ngOnInit() { }
}
