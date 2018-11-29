import { Pipe, PipeTransform } from '@angular/core';

import { EventIntegration } from '../model';

@Pipe({ name: 'cpEventIntegrationStatus' })
export class EventIntegrationStatusPipe implements PipeTransform {
  transform(value: number): any {
    if (value === EventIntegration.status.successful) {
      return 't_shared_successful';
    } else if (value === EventIntegration.status.error) {
      return 't_shared_error';
    } else if (value === EventIntegration.status.pending) {
      return 't_shared_pending';
    }
  }
}
