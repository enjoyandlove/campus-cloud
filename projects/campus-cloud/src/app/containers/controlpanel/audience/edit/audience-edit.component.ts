import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { ISnackbar } from '@campus-cloud/store/base';
import { AudienceType } from './../audience.status';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { AudienceService } from '../audience.service';
import { parseErrorResponse } from '@campus-cloud/shared/utils/http';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';
import { AudienceUtilsService } from '../audience.utils.service';

@Component({
  selector: 'cp-audience-edit',
  templateUrl: './audience-edit.component.html',
  styleUrls: ['./audience-edit.component.scss']
})
export class AuidenceEditComponent extends BaseComponent implements OnInit {
  @Input() audienceId: number;

  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  loading;
  audience;
  isError;
  buttonData;
  errorMessage;
  userCount = 0;
  form: FormGroup;
  eventProperties;
  defaultAudienceView;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    private service: AudienceService,
    private cpTracking: CPTrackingService,
    private audienceUtils: AudienceUtilsService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  doSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.updateAudience(this.audienceId, this.form.value, search).subscribe(
      (_) => {
        $('#audienceEdit').modal('hide');
        this.edited.emit(this.form.value);
        this.trackEditAudience();
        this.resetModal();
      },
      (err) => {
        this.isError = true;
        const error = parseErrorResponse(err.error);
        if (error === 'Database Error') {
          this.errorMessage = this.cpI18n.translate('audience_create_error_duplicate_audience');

          return;
        }
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  resetModal() {
    if (this.form) {
      this.form.reset();
    }
    this.reset.emit();
  }

  onAudienceSelected(userIds: Array<number>) {
    this.userCount = userIds.length;
    this.form.controls['user_ids'].setValue(userIds);

    this.buttonData = { ...this.buttonData, disabled: !this.validate() };

    this.eventProperties = {
      ...this.eventProperties,
      updated_list: true
    };
  }

  onFiltersSelected(filters) {
    this.form.controls['filters'].setValue(filters);

    this.eventProperties = {
      ...this.eventProperties,
      updated_list: true,
      filter_count: filters.length
    };
  }

  validate() {
    return this.form.valid && this.userCount > 0;
  }

  buildChips() {
    return this.audience.users.map((user) => {
      return {
        label: `${user.email}`,
        id: user.id
      };
    });
  }

  initCustom() {
    const userIds = this.audience.users.map((user) => user.id);
    this.form.addControl('user_ids', new FormControl(userIds, Validators.required));

    this.audience = Object.assign({}, this.audience, { users: this.buildChips() });
  }

  initDynamic() {
    const filters = this.audience.filters.map(({ attr_id, choices }) => {
      return {
        attr_id,
        choices
      };
    });

    this.form.addControl('filters', new FormControl(filters, Validators.required));
  }

  onUserCount(userCount) {
    this.userCount = userCount;
    this.buttonData = { ...this.buttonData, disabled: !this.validate() };
  }

  trackEditAudience() {
    const updated_name = !isEqual(this.audience.name, this.form.controls['name'].value);
    this.eventProperties = {
      ...this.eventProperties,
      updated_name
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_UPDATED_AUDIENCE,
      this.eventProperties
    );
  }

  fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getAudienceById(this.audienceId, search);

    super.fetchData(stream$).then((audience) => {
      this.audience = audience.data;

      this.userCount = this.audience.count;

      this.form = this.fb.group({
        name: [this.audience.name, Validators.required]
      });

      this.form.valueChanges.subscribe(() => {
        this.buttonData = { ...this.buttonData, disabled: !this.validate() };
      });

      this.defaultAudienceView = this.audience.type;

      if (this.audience.type === AudienceType.custom) {
        this.initCustom();
      }

      if (this.audience.type === AudienceType.dynamic) {
        this.initDynamic();
      }

      this.eventProperties = {
        ...this.audienceUtils.getAmplitudeEvent(this.audience, true),
        updated_list: false
      };
    });
  }

  ngOnInit() {
    this.fetch();

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('update')
    };
  }
}
