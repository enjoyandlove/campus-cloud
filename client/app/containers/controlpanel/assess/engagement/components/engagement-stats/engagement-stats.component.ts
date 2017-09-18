import {
  Input,
  OnInit,
  Output,
  Component,
  EventEmitter,
} from '@angular/core';

import * as moment from 'moment';

declare var $;

interface IProps {
  ends: number;
  starts: number;
  series: Array<number>;
  zero_engagements: Array<number>;
  one_engagements: Array<number>;
  repeat_engagements: Array<number>;
}

@Component({
  selector: 'cp-engagement-stats',
  templateUrl: './engagement-stats.component.html',
  styleUrls: ['./engagement-stats.component.scss'],
})
export class EngagementStatsComponent implements OnInit {
  @Input() props: IProps;
  @Output() doCompose: EventEmitter<{ name: string, userIds: Array<number> }> = new EventEmitter();

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
    let { zero_engagements, one_engagements, repeat_engagements } = this.props;
    let total = zero_engagements.length + one_engagements.length + repeat_engagements.length;

    if (total === 0) {
      return 0;
    }

    let percentage = (this.props[key].length * 100) / total;

    return percentage === 0 ? percentage : percentage.toFixed(1);
  }

  onDownload(key) {
    console.log('downloading ', key);
  }

  ngOnInit() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.noEngagementPercentage = this.getPercentage('zero_engagements');
    this.oneEngagementPercentage = this.getPercentage('one_engagements');
    this.repeatEngagementPercentage = this.getPercentage('repeat_engagements');
  }
}
