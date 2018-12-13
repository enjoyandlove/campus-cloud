import { Pipe, PipeTransform } from '@angular/core';

import { FeedIntegration } from '../model';

@Pipe({ name: 'cpIntegrationStatus' })
export class IntegrationStatusPipe implements PipeTransform {
  transform(value: number): any {
    if (value === FeedIntegration.status.successful) {
      return 't_shared_successful';
    } else if (value === FeedIntegration.status.error) {
      return 't_shared_error';
    } else if (value === FeedIntegration.status.pending) {
      return 't_shared_pending';
    }
  }
}
