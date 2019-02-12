import { CPDate } from '@shared/utils';
import { IEventIntegration } from './event-integration.interface';
import { EventIntegration } from '@libs/integrations/events/model';
import { mockIntegration } from '@client/app/containers/controlpanel/manage/events/integrations/tests';

describe('EventIntegration', () => {
  describe('isNotRunning', () => {
    it('should return false if sync_status is running', () => {
      let result: boolean;
      let feed: IEventIntegration;

      feed = {
        ...mockIntegration,
        sync_status: EventIntegration.status.pending
      };

      result = EventIntegration.isNotRunning(feed);

      expect(result).toEqual(true);

      feed = {
        ...mockIntegration,
        sync_status: EventIntegration.status.running
      };

      result = EventIntegration.isNotRunning(feed);

      expect(result).toEqual(false);
    });
  });

  describe('isLastSyncAfterThreshold', () => {
    it('should return false if last_successful_sync_epoch is less than one minute form now', () => {
      let result: boolean;
      const tz = 'America/Toronto';
      const now = CPDate.now(tz).unix();
      const twoDaysAgo = CPDate.now(tz)
        .subtract(2, 'days')
        .unix();
      let feed: IEventIntegration;

      feed = {
        ...mockIntegration,
        last_successful_sync_epoch: now
      };

      result = EventIntegration.isLastSyncAfterThreshold(feed, tz);

      expect(result).toEqual(false);

      feed = {
        ...mockIntegration,
        sync_status: twoDaysAgo
      };

      result = EventIntegration.isNotRunning(feed);

      expect(result).toEqual(true);
    });
  });
});
