import { Pipe, PipeTransform } from '@angular/core';

import { FeedIntegration } from '../model';

export const statusToLabelMapping = {
  [FeedIntegration.status.error]: 't_shared_error',
  [FeedIntegration.status.pending]: 't_shared_pending',
  [FeedIntegration.status.running]: 't_shared_running',
  [FeedIntegration.status.successful]: 't_shared_successful'
};

@Pipe({ name: 'cpIntegrationStatus' })
export class IntegrationStatusPipe implements PipeTransform {
  transform(value: number): any {
    return statusToLabelMapping[value] || '';
  }
}
