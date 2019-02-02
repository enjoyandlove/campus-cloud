import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { CPSession } from '@app/session';
import { FORMAT } from '@client/app/shared/pipes';
import { SyncStatus, IntegrationStatus } from '../../../common/model';
import { EventFeedObjectType, IEventIntegration, EventIntegration } from './../../model';

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

  constructor(private session: CPSession) {}

  onListItemClick(integration: IEventIntegration) {
    if (integration.feed_obj_type !== EventFeedObjectType.campusEvent) {
      return;
    }

    this.editClick.emit(integration);
  }

  canSync(feed: IEventIntegration) {
    return (
      EventIntegration.isNotRunning(feed) &&
      EventIntegration.isLastSyncAfterThreshold(feed, this.session.tz)
    );
  }

  syncNowTooltip(feed: IEventIntegration) {
    const isLastSyncAfterThreshold = EventIntegration.isLastSyncAfterThreshold(
      feed,
      this.session.tz
    );

    if (feed.sync_status === EventIntegration.status.running) {
      return 't_integration_sync_button_int_running_tooltip';
    } else if (!isLastSyncAfterThreshold) {
      return 't_integration_sync_button_int_not_ready_to_sync_tooltip';
    }
  }

  ngOnInit() {}
}
