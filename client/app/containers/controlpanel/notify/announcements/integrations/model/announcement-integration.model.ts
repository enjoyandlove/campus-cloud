import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CustomValidators } from '@shared/validators';
import { IntegrationTypes } from '@libs/integrations/common/model';
import { AnnouncementPriority } from './../../announcements.interface';
import { IAnnouncementsIntegration } from './announcement-integration.interface';

export class AnnouncementIntegrationModel {
  static form(integration?: IAnnouncementsIntegration): FormGroup {
    const _integration = {
      school_id: integration ? integration.school_id : null,
      feed_url: integration ? integration.feed_url : null,
      feed_type: integration ? integration.feed_type : IntegrationTypes.rss,
      store_id: integration ? integration.store_id : null,
      priority: integration ? integration.priority : AnnouncementPriority.regular
    };

    const fb = new FormBuilder();

    return fb.group({
      school_id: [
        _integration.school_id,
        Validators.compose([CustomValidators.positiveInteger, Validators.required])
      ],
      feed_url: [
        _integration.feed_url,
        Validators.compose([
          Validators.required,
          Validators.maxLength(1024),
          CustomValidators.requiredNonEmpty
        ])
      ],
      feed_type: [
        _integration.feed_type,
        Validators.compose([
          Validators.required,
          CustomValidators.oneOf([IntegrationTypes.atom, IntegrationTypes.rss])
        ])
      ],
      store_id: [
        _integration.store_id,
        Validators.compose([Validators.required, CustomValidators.positiveInteger])
      ],
      priority: [
        _integration.priority,
        Validators.compose([
          Validators.required,
          CustomValidators.oneOf([AnnouncementPriority.regular, AnnouncementPriority.emergency])
        ])
      ]
    });
  }
}
