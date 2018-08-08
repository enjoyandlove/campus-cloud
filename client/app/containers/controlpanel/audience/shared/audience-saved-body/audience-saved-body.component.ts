/*tslint:disable:max-line-length */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

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
  selectedItem;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: AudienceService,
    public utils: AudienceUtilsService
  ) {}

  fetch() {
    if (!this.canReadAudience) {
      return;
    }

    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('with_user_count', UserCount.withUserCount.toString())
      .append('platform', PersonaType.app.toString());

    const audiences$ = this.service.getAudiences(search, 1, 1000);

    const persona$ = this.service.getPersona(search, 1, 1000);

    const stream$ = combineLatest(audiences$, persona$, this.importedAudience$);

    stream$.subscribe((res: any) => {
      // @data [audiences, persona, importedAudience]
      let _persona = [];
      let _audiences = [];

      _persona = this.utils.parsedPersona(res[1]);
      _audiences = this.utils.parsedAudience(res[0]);

      if (res[2]) {
        this.selectedItem = _audiences.filter(
          (audience) => audience.action === res[2]
        )[0];

        this.selected.emit(this.selectedItem);
      }

      this.audiences = [
        ...this.audiences,
        ..._persona,
        ..._audiences
      ];
    });
  }

  ngOnInit(): void {
    this.audiences = [
      {
        action: null,
        label: this.cpI18n.translate('campus_wide')
      }
    ];

    this.fetch();
  }
}
