/*tslint:disable:max-line-length */
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { get as _get } from 'lodash';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AudienceService } from './../../../../../containers/controlpanel/audience/audience.service';
import { CPI18nService } from './../../../../../shared/services';
import { CPSession } from '../../../../../session';

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
        isList: true,
        userCount: users,
        action: audience.id,
        label: audience.name,
        type: audience.type
      };
    });

    if (audiences.length) {
      audiences.unshift(heading);
    }

    this.audiences = audiences;

    return audiences;
  }

  parsedPersona(persona): Array<any> {
    const _persona = [];

    persona = persona.map((p) => {

      if (p.hasOwnProperty('localized_name_map')) {
        _persona.push({
          action: p.id,
          type: 'persona',
          isPersona: true,
          userCount: p.user_count,
          label: this.getLocalizedLabel(p.localized_name_map)
        });
      }
    });

    return _persona;
  }

  getLocalizedLabel(label) {
    const defaultLocale = 'en-US';

    return CPI18nService.getLocale() === defaultLocale
      ? label.en
      : label.fr;
  }

  fetch() {
    if (!this.canReadAudience) {
      this.audiences$ = observableOf([
        {
          action: null,
          label: this.cpI18n.translate('campus_wide')
        }
      ]);

      return;
    }

    const with_user_count = 1;
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('with_user_count', with_user_count.toString());

    const audiences$ = this.service.getAudiences(search, 1, 1000).pipe(
      startWith([
        {
          action: null,
          label: this.cpI18n.translate('campus_wide')
        }
      ]),
      map((audiences) => {
        return [
          {
            action: null,
            label: this.cpI18n.translate('campus_wide')
          },
          ...this.parsedAudience(audiences)
        ];
      })
    );

    const persona$ = this.service.getPersona(search, 1, 1000).pipe(
      startWith([
        {
          action: null,
          heading: true,
          label: this.cpI18n.translate('t_notify_announcement_audiences_my_experiences')
        }
      ]),
      map((persona) => {
        return [
          {
            action: null,
            heading: true,
            label: this.cpI18n.translate('t_notify_announcement_audiences_my_experiences')
          },
          ...this.parsedPersona(persona)
        ];
      })
    );

    this.audiences$ = combineLatest(audiences$, persona$, this.importedAudience$).pipe(
      map(([audiences, persona, importedAudienceId]: any) => {
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

        return [...audiences, ...persona];
      })
    );
  }

  ngOnInit(): void {
    this.fetch();
  }
}
