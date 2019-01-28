import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { FORMAT } from '@client/app/shared/pipes';
import { FeedIntegration, SyncStatus } from '../../../common/model';

@Component({
  selector: 'cp-event-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class EventIntegrationsListComponent implements OnInit {
  @Input() integrations$: Observable<FeedIntegration[]>;

  @Output() syncClick: EventEmitter<number> = new EventEmitter();
  @Output() editClick: EventEmitter<FeedIntegration> = new EventEmitter();
  @Output() deleteClick: EventEmitter<FeedIntegration> = new EventEmitter();

  notSynced = SyncStatus.notSynced;

  dateFormat = FORMAT.DATETIME;

  constructor() {}

  ngOnInit() {}
}
