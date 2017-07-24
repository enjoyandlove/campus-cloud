import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

interface IProps {
  ends: number;
  starts: number;
  chart_data: Array<number>;
  no_engagement: Array<number>;
  one_engagement: Array<number>;
  repeat_engagement: Array<number>;
}

@Component({
  selector: 'cp-engagement-stats',
  templateUrl: './engagement-stats.component.html',
  styleUrls: ['./engagement-stats.component.scss']
})
export class EngagementStatsComponent implements OnInit {
  @Input() props: IProps;
  @Output() doCompose: EventEmitter<{name: string, userIds: Array<number>}> = new EventEmitter();

  loading;
  noEngagementPercentage;
  oneEngagementPercentage;
  repeatEngagementPercentage;

  constructor() { }

  onCompose(listName, userIds) {
    const { starts, ends } = this.props;
    const startDate = moment.unix(starts).format('DD/MM');
    const endDate = moment.unix(ends).format('DD/MM');
    const name = `${listName} ${startDate} - ${endDate}`;

    this.doCompose.emit({ name, userIds });
  }

  getPercentage(key) {
    let { no_engagement, one_engagement, repeat_engagement } = this.props;
    let total =  no_engagement.length + one_engagement.length + repeat_engagement.length;

    return ((this.props[key].length * 100) / total).toFixed(1);
  }

  onDownload(key) {
    console.log('downloading ', key);
  }

  ngOnInit() {
    // this.props = Object.assign({}, this.props, { no_engagement: [] });

    this.noEngagementPercentage = this.getPercentage('no_engagement');
    this.oneEngagementPercentage = this.getPercentage('one_engagement');
    this.repeatEngagementPercentage = this.getPercentage('repeat_engagement');
  }
}
