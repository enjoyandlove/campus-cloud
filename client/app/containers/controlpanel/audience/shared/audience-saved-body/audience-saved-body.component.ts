/*tslint:disable:max-line-length */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';

import { CPSession } from '../../../../../session';
import { PersonaType, UserCount } from '../../audience.status';
import { CPI18nService } from './../../../../../shared/services';
import { AudienceUtilsService } from '../../audience.utils.service';
import { AudienceService } from './../../../../../containers/controlpanel/audience/audience.service';

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
    public service: AudienceService,
    public utils: AudienceUtilsService
  ) {}

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

    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('with_user_count', UserCount.withUserCount.toString())
      .append('platform', PersonaType.app.toString());

    const audiences$ = this.service.getAudiences(search, 1, 1000).pipe(
      startWith([
        {
          action: null,
          heading: true,
          label: this.cpI18n.translate('audience_my_audiences')
        }
      ]),
      map((audiences) => {
        return [
          {
            action: null,
            heading: true,
            label: this.cpI18n.translate('audience_my_audiences')
          },
          ...this.utils.parsedAudience(audiences)
        ];
      })
    );

    const persona$ = this.service.getPersona(search, 1, 1000).pipe(
      startWith([
        {
          action: null,
          label: this.cpI18n.translate('campus_wide')
        }
      ]),
      map((persona, index) => {
        let _personas = [];
        const heading = [
          {
            action: null,
            label: this.cpI18n.translate('campus_wide')
          }
        ];

        if (index !== 0) {
          _personas = persona;
        }

        return [
          ...heading,
          ...this.utils.parsedPersona(_personas)
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

        return [...persona, ...audiences];
      })
    );
  }

  ngOnInit(): void {
    this.fetch();
  }
}
