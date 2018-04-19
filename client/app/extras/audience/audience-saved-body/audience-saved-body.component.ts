import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { get as _get } from 'lodash';

import { CPSession } from '../../../session';

import { AudienceService } from './../../../containers/controlpanel/audience/audience.service';
import { CPI18nService } from '../../../shared/services';

@Component({
  selector: 'cp-audience-saved-body',
  templateUrl: './audience-saved-body.component.html',
  styleUrls: ['./audience-saved-body.component.scss']
})
export class AudienceSavedBodyComponent implements OnInit {
  @Output() selected: EventEmitter<{ action: number; heading: string }> = new EventEmitter();
  audiences$;

  constructor(
    public session: CPSession,
    public service: AudienceService,
    public cpI18n: CPI18nService
  ) {}

  parsedAudience(audiences): Array<any> {
    const heading = {
      action: null,
      heading: true,
      label: this.cpI18n.translate('audience_my_audiences')
    };

    audiences = audiences.map((audience) => {
      const users = _get(audience, 'users', []);

      return {
        action: audience.id,
        label: audience.name,
        userCount: users.length
      };
    });

    if (audiences.length) {
      audiences.unshift(heading);
    }

    return audiences;
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.audiences$ = this.service
      .getAudiences(search, 1, 1000)
      .startWith([
        {
          action: null,
          label: this.cpI18n.translate('campus_wide')
        }
      ])
      .map((audiences) => {
        return [
          {
            action: null,
            label: this.cpI18n.translate('campus_wide')
          },
          ...this.parsedAudience(audiences)
        ];
      });
  }

  ngOnInit(): void {
    this.fetch();
  }
}
