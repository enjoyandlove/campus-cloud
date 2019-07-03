import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { PersonaType, UserCount } from '../../audience.status';
import { AudienceUtilsService } from '../../audience.utils.service';
import { AudienceService } from '@controlpanel/audience/audience.service';

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

    const isCustomizationEnabled = this.session.school.has_guide_customization;

    const audiences$ = this.service.getAudiences(search, 1, 1000);

    const persona$ = isCustomizationEnabled ? this.service.getPersona(search, 1, 1000) : of([]);

    const stream$ = combineLatest([audiences$, persona$, this.importedAudience$]);

    stream$.subscribe((res: any) => {
      let [audiences, personas] = res;
      const importedAudience = res.importedAudience;

      personas = this.utils.parsedPersona(personas);
      audiences = this.utils.parsedAudience(audiences);

      if (importedAudience) {
        this.selectedItem = audiences.filter((audience) => audience.action === importedAudience)[0];

        this.selected.emit(this.selectedItem);
      }

      this.audiences = [...this.audiences, ...personas, ...audiences];
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
