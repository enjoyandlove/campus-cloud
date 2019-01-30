import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { FORMAT } from '@client/app/shared/pipes';
import { SyncStatus, IntegrationStatus } from '../../../common/model';
import { EventFeedObjectType, IEventIntegration } from './../../model';

@Component({
  selector: 'cp-event-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class EventIntegrationsListComponent implements OnInit {
  @Input() integrations$: Observable<IEventIntegration[]>;

  @Output() syncClick: EventEmitter<number> = new EventEmitter();
  @Output() editClick: EventEmitter<IEventIntegration> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IEventIntegration> = new EventEmitter();

  notSynced = SyncStatus.notSynced;
  runningStatus = IntegrationStatus.running;
  campusEvent = EventFeedObjectType.campusEvent;

  dateFormat = FORMAT.DATETIME;

  constructor() {}

  onListItemClick(integration: IEventIntegration) {
    if (integration.feed_obj_type !== EventFeedObjectType.campusEvent) {
      return;
    }

    this.editClick.emit(integration);
  }

  ngOnInit() {}
}
