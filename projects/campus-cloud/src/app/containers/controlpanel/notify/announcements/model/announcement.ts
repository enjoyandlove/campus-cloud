import { CustomValidators } from '@campus-cloud/shared/validators';
import { FormBuilder, Validators } from '@angular/forms';
import { get as _get } from 'lodash';

import { IAnnouncement, notifyAtEpochNow } from './announcement.interface';

export class Announcement {
  static form(announcement?: IAnnouncement) {
    const fb = new FormBuilder();

    return fb.group({
      store_id: [_get(announcement, 'store_id', null), Validators.required],
      user_ids: [_get(announcement, 'user_ids', [])],
      list_ids: [_get(announcement, 'list_ids', [])],
      filters: [_get(announcement, 'filters', [])],
      persona_id: [_get(announcement, 'persona_id', null)],
      is_school_wide: [_get(announcement, 'is_school_wide', true)],
      notify_at_epoch: [_get(announcement, 'notify_at_epoch', notifyAtEpochNow)],
      subject: [
        _get(announcement, 'subject', null),
        [CustomValidators.requiredNonEmpty, Validators.maxLength(128)]
      ],
      message: [
        _get(announcement, 'message', null),
        [CustomValidators.requiredNonEmpty, Validators.maxLength(1024)]
      ],
      priority: [_get(announcement, 'priority', null), Validators.required]
    });
  }
}
