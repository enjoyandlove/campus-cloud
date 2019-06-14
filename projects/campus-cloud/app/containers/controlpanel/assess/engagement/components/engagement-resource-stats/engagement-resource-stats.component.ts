import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EngagementUtilsService } from '../../engagement.utils.service';
import { environment } from './../../../../../../../environments/environment';

@Component({
  selector: 'cp-engagement-resource-stats',
  templateUrl: './engagement-resource-stats.component.html',
  styleUrls: ['./engagement-resource-stats.component.scss']
})
export class EngagementResourceStatsComponent implements OnInit {
  @Input() items;
  @Input() labels;
  @Input() loading;
  @Input() isSorting;
  @Input() sortingBy;
  @Input() stats: Array<any>;

  @Output() sortBy: EventEmitter<null> = new EventEmitter();

  sortyBy;
  defaultImage = `${environment.root}assets/default/user.png`;

  constructor(public utils: EngagementUtilsService) {}

  ngOnInit() {
    this.sortyBy = this.utils.resourceSortingFilter();
  }
}
