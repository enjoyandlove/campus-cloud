import { Component, Output, EventEmitter, Input } from '@angular/core';

import { CPSession } from '@client/app/session';
import { CPI18nService } from '@shared/services';
import { FeedIntegration } from '@libs/integrations/common/model';
import { IWallsIntegration } from '@libs/integrations/walls/model';
import { IEventIntegration } from '@libs/integrations/events/model';

@Component({
  selector: 'cp-integrations-sync-now-button',
  templateUrl: './integrations-sync-now-button.component.html',
  styleUrls: ['./integrations-sync-now-button.component.scss']
})
export class IntegrationsSyncNowButtonComponent {
  @Input() integration: IWallsIntegration | IEventIntegration;

  @Output() syncClick: EventEmitter<null> = new EventEmitter();

  constructor(private session: CPSession, private cpI18n: CPI18nService) {}

  get tootlTipTitle() {
    const canSync = this.canSync(this.integration);
    const toolTipKey = this.syncNowTooltip(this.integration);
    const toolTipText = this.cpI18n.translate(toolTipKey);
    return !canSync ? toolTipText : '';
  }

  canSync(feed: IEventIntegration | IWallsIntegration) {
    return (
      FeedIntegration.isNotRunning(feed) &&
      FeedIntegration.isLastSyncAfterThreshold(feed, this.session.tz)
    );
  }

  syncNowTooltip(feed: IWallsIntegration | IEventIntegration) {
    const isLastSyncAfterThreshold = FeedIntegration.isLastSyncAfterThreshold(
      feed,
      this.session.tz
    );

    if (feed.sync_status === FeedIntegration.status.running) {
      return 't_integration_sync_button_int_running_tooltip';
    } else if (!isLastSyncAfterThreshold) {
      return 't_integration_sync_button_int_not_ready_to_sync_tooltip';
    }
  }
}
