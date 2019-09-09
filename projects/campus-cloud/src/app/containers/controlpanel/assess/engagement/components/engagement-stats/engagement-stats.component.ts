import { Input, OnInit, Output, Component, EventEmitter } from '@angular/core';

import * as moment from 'moment';
import { CPI18nService } from '@campus-cloud/shared/services';

interface IProps {
  ends: number;
  starts: number;
  zero_engagements: Array<number>;
  one_engagements: Array<number>;
  repeat_engagements: Array<number>;
}

@Component({
  selector: 'cp-engagement-stats',
  templateUrl: './engagement-stats.component.html',
  styleUrls: ['./engagement-stats.component.scss']
})
export class EngagementStatsComponent implements OnInit {
  @Input() props: IProps;
  @Output() download: EventEmitter<number> = new EventEmitter();
  @Output()
  doCompose: EventEmitter<{
    name: string;
    label: string;
    userIds: Array<number>;
  }> = new EventEmitter();

  loading;
  noEngagementPercentage;
  oneEngagementPercentage;
  repeatEngagementPercentage;

  ONE_ENGAGEMENT = 2;
  ZERO_ENGAGEMENT = 3;
  REPEAT_ENGAGEMENT = 1;

  constructor(public cpI18n: CPI18nService) {}

  getIds(idsOrEmailList: Array<string | number>) {
    return idsOrEmailList.filter((i) => typeof i === 'number');
  }

  onCompose(listName, userIds) {
    const { starts, ends } = this.props;
    const label = listName;
    const startDate = moment.unix(starts).format('DD/MM');
    const endDate = moment.unix(ends).format('DD/MM');
    const name = `${listName} ${startDate} - ${endDate}`;

    this.doCompose.emit({ name, label, userIds });
  }

  getPercentage(key) {
    const { zero_engagements, one_engagements, repeat_engagements } = this.props;
    const total = zero_engagements.length + one_engagements.length + repeat_engagements.length;

    if (total === 0) {
      return 0;
    }

    const percentage = (this.props[key].length * 100) / total;

    return percentage === 0 ? percentage : percentage.toFixed(1);
  }

  ngOnInit() {
    this.noEngagementPercentage = this.getPercentage('zero_engagements');
    this.oneEngagementPercentage = this.getPercentage('one_engagements');
    this.repeatEngagementPercentage = this.getPercentage('repeat_engagements');
  }
}
