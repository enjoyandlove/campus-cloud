/*tslint:disable:max-line-length */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get as _get } from 'lodash';

import { CPSession } from '../../../../../session';

import { AudienceService } from './../../../../../containers/controlpanel/audience/audience.service';
import { CPI18nService } from './../../../../../shared/services';

@Component({
  selector: 'cp-audience-saved-body',
  templateUrl: './audience-saved-body.component.html',
  styleUrls: ['./audience-saved-body.component.scss']
})
export class AudienceSavedBodyComponent implements OnInit {
  @Input() reset: Observable<boolean>;
  @Input() canReadAudience: boolean;
  @Input() importedAudience$: Observable<{ label: string; action: number }>;

  @Output() selected: EventEmitter<{ action: number; label: string }> = new EventEmitter();

  audiences;
  audiences$;
  selectedItem;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: AudienceService
  ) {}

  parsedAudience(audiences): Array<any> {
    const heading = {
      action: null,
      heading: true,
      label: this.cpI18n.translate('audience_my_audiences')
    };

    audiences = audiences.map((audience) => {
      const users = _get(audience, 'count', null);

      return {
        action: audience.id,
        label: audience.name,
        userCount: users
      };
    });

    if (audiences.length) {
      audiences.unshift(heading);
    }

    this.audiences = audiences;

    return audiences;
  }

  fetch() {
    if (!this.canReadAudience) {
      this.audiences$ = Observable.of([
        {
          action: null,
          label: this.cpI18n.translate('campus_wide')
        }
      ]);
    }

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    const audiences$ = this.service
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

    this.audiences$ = Observable.combineLatest(audiences$, this.importedAudience$).map(
      ([audiences, importedAudienceId]) => {
        if (importedAudienceId) {
          this.selectedItem = audiences.filter(
            (audience) => audience.action === importedAudienceId
          )[0];

          // the first run is undefined
          if (this.selectedItem) {
            this.selected.emit(this.selectedItem);
          }
        } else {
          this.selected.emit({
            action: null,
            label: this.cpI18n.translate('campus_wide')
          });
        }

        return audiences;
      }
    );
  }

  ngOnInit(): void {
    this.fetch();
  }
}
