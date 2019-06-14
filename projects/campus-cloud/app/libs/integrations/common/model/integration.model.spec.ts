import { CPDate } from '@shared/utils';
import { IFeedIntegration } from './integration.interface';
import { FeedIntegration } from '@libs/integrations/common/model';
import { mockIntegration } from '@containers/controlpanel/manage/events/integrations/tests';

describe('FeedIntegration', () => {
  describe('isNotRunning', () => {
    it('should return false if sync_status is running', () => {
      let result: boolean;
      let feed: IFeedIntegration;

      feed = {
        ...mockIntegration,
        sync_status: FeedIntegration.status.pending
      };

      result = FeedIntegration.isNotRunning(feed);

      expect(result).toEqual(true);

      feed = {
        ...mockIntegration,
        sync_status: FeedIntegration.status.running
      };

      result = FeedIntegration.isNotRunning(feed);

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
      let feed: IFeedIntegration;

      feed = {
        ...mockIntegration,
        last_successful_sync_epoch: now
      };

      result = FeedIntegration.isLastSyncAfterThreshold(feed, tz);

      expect(result).toEqual(false);

      feed = {
        ...mockIntegration,
        sync_status: twoDaysAgo
      };

      result = FeedIntegration.isNotRunning(feed);

      expect(result).toEqual(true);
    });
  });
});
