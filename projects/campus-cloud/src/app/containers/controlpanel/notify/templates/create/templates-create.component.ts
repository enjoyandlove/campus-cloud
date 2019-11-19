import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { TooltipOption } from 'bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { TemplatesService } from './../templates.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { TemplatesAmplitudeService } from './../templates.amplitude.service';
import { CP_PRIVILEGES_MAP, amplitudeEvents } from '@campus-cloud/shared/constants';
import { AnnouncementsService } from './../../announcements/announcements.service';
import { TemplatesComposeComponent } from '../compose/templates-compose.component';
import {
  CPI18nService,
  StoreService,
  CPTrackingService,
  ZendeskService
} from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-templates-create',
  templateUrl: './templates-create.component.html',
  styleUrls: ['./templates-create.component.scss']
})
export class TemplatesCreateComponent extends TemplatesComposeComponent
  implements OnInit, OnDestroy {
  form: FormGroup;
  toolTipContent: string;
  toolTipOptions: TooltipOption;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: StoreService,
    public service: AnnouncementsService,
    public cpTracking: CPTrackingService,
    private childService: TemplatesService
  ) {
    super(el, fb, session, cpI18n, storeService, cpTracking, service);
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  onTypeChanged(type) {
    super.onTypeChanged(type);
  }

  doUserSearch(query) {
    super.doUserSearch(query);
  }

  getSubjectLength() {
    return super.getSubjectLength();
  }

  onSearch(query) {
    super.onSearch(query);
  }

  doListsSearch(query) {
    super.doListsSearch(query);
  }

  getTypeFromArray(id) {
    super.getTypeFromArray(id);
  }

  resetModal() {
    this.form.reset();
    this.isError = false;
    this.state.isCampusWide = false;
    this.resetCustomFields$.next(true);

    this.subject_prefix = {
      label: null,
      type: null
    };

    $('#templateCreateModal').modal('hide');

    this.resetChips();

    this.teardown.emit();
  }

  onHandleToggle(status) {
    super.onHandleToggle(status);
  }

  onSelectedStore(store) {
    super.onSelectedStore(store);
  }

  doSubmit() {
    this.isError = false;

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    let data = {
      store_id: this.form.value.store_id,
      name: this.form.value.name,
      is_school_wide: this.form.value.is_school_wide,
      subject: this.form.value.subject,
      message: this.form.value.message,
      priority: this.form.value.priority
    };

    if (this.state.isToUsers && !this.state.isCampusWide) {
      data = Object.assign({}, data, { user_ids: this.form.value.user_ids });
    }

    if (this.state.isToLists && !this.state.isCampusWide) {
      data = Object.assign({}, data, { list_ids: this.form.value.list_ids });
    }

    this.childService.createTemplate(search, data).subscribe(
      (res: any) => {
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.NOTIFY_CREATED_COMMUNICATION, {
          ...TemplatesAmplitudeService.getAmplitudeProperties(data as any)
        });

        this.form.reset();
        this.created.emit(this.form.value);
        this.resetModal();
      },
      (_) => {
        this.isError = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  getObjectFromTypesArray(id) {
    super.getObjectFromTypesArray(id);
  }

  onSwitchSearchType(type) {
    super.onSwitchSearchType(type);
  }

  resetChips() {
    super.resetChips();
  }

  onTypeAheadChange(ids) {
    super.onTypeAheadChange(ids);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.emitDestroy();
  }

  ngOnInit() {
    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    this.toolTipOptions = {
      html: true,
      trigger: 'click'
    };

    this.toolTipContent = `
      <span class="d-block text-left">
        ${this.cpI18n.translate('notify_announcement_template_to_tooltip')}
      </span>
      <a class="text-left d-block" href='${ZendeskService.zdRoot()}/articles/115004330554-Create-a-List-of-Students}'>
        ${this.cpI18n.translate('lists_button_create')}
      </a>
    `;

    let canDoEmergency;

    this.typeAheadOpts = {
      withSwitcher: canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.audience),
      suggestions: this.suggestions,
      reset: this.resetChips$,
      unsetOverflow: true
    };
    const schoolPrivileges = this.session.g.get('user').school_level_privileges[
      this.session.g.get('school').id
    ];

    try {
      canDoEmergency = schoolPrivileges[CP_PRIVILEGES_MAP.emergency_announcement].w;
    } catch (error) {
      canDoEmergency = false;
    }

    this.types = require('../compose/announcement-types').types;

    if (!canDoEmergency) {
      this.types = this.types.filter((type) => type.action !== this.EMERGENCY_TYPE);
    }

    this.form = this.fb.group({
      store_id: [defaultHost, Validators.required],
      user_ids: [[]],
      list_ids: [[]],
      is_school_wide: false,
      subject: [null, [CustomValidators.requiredNonEmpty, Validators.maxLength(128)]],
      message: [null, [CustomValidators.requiredNonEmpty, Validators.maxLength(400)]],
      priority: [this.types[0].action, Validators.required]
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      let isValid = true;

      isValid = this.form.valid;

      if (this.state.isToLists) {
        if (this.form.controls['list_ids'].value) {
          isValid = this.form.controls['list_ids'].value.length >= 1 && this.form.valid;
        }
      }

      if (this.state.isToUsers) {
        if (this.form.controls['user_ids'].value) {
          isValid = this.form.controls['user_ids'].value.length >= 1 && this.form.valid;
        }
      }

      this.isFormValid = isValid;
    });
    const control = new FormControl(null, CustomValidators.requiredNonEmpty);

    this.form.addControl('name', control);
  }
}
