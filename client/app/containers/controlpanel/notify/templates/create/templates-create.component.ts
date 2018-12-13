/* tslint:disable:max-line-length */
import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@app/session';
import { TemplatesService } from './../templates.service';
import { NotifyUtilsService } from '../../notify.utils.service';
import { amplitudeEvents } from '@app/shared/constants/analytics';
import { CP_PRIVILEGES_MAP } from '@app/shared/constants/privileges';
import { canSchoolWriteResource } from '@app/shared/utils/privileges/privileges';
import { AnnouncementsService } from './../../announcements/announcements.service';
import { TemplatesComposeComponent } from '../compose/templates-compose.component';
import { IToolTipContent } from '@app/shared/components/cp-tooltip/cp-tooltip.interface';
import { CPI18nService, StoreService, ZendeskService, CPTrackingService } from '@app/shared/services';

declare var $;

@Component({
  selector: 'cp-templates-create',
  templateUrl: './templates-create.component.html',
  styleUrls: ['./templates-create.component.scss']
})
export class TemplatesCreateComponent extends TemplatesComposeComponent
  implements OnInit, OnDestroy {
  form: FormGroup;
  toolTipContent: IToolTipContent;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: NotifyUtilsService,
    public storeService: StoreService,
    public service: AnnouncementsService,
    public cpTracking: CPTrackingService,
    private childService: TemplatesService
  ) {
    super(el, fb, session, cpI18n, utils, storeService, cpTracking, service);
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
    this.amplitudeEventProperties = {
      ...this.amplitudeEventProperties,
      announcement_type: type.label
    };
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
    this.shouldConfirm = false;
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
        this.amplitudeEventProperties = {
          ...this.amplitudeEventProperties,
          announcement_id: res.id
        };

        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.NOTIFY_CREATED_TEMPLATE,
          this.amplitudeEventProperties
        );
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

  onConfirmed() {
    super.onConfirmed();
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
  }

  ngOnInit() {
    const host_type = this.session.defaultHost ? this.session.defaultHost.hostType : null;
    this.amplitudeEventProperties = {
      ...this.amplitudeEventProperties,
      host_type
    };
    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    this.sendAsName = this.session.defaultHost ? this.session.defaultHost.label : undefined;

    this.toolTipContent = Object.assign({}, this.toolTipContent, {
      content: this.cpI18n.translate('notify_announcement_template_to_tooltip'),
      link: {
        text: this.cpI18n.translate('lists_button_create'),
        url: `${ZendeskService.zdRoot()}/articles/115004330554-Create-a-List-of-Students`
      }
    });

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
      subject: [null, [Validators.required, Validators.maxLength(128)]],
      message: [null, [Validators.required, Validators.maxLength(400)]],
      priority: [this.types[0].action, Validators.required]
    },
      {validator: this.utils.trimWhiteSpaces}
      );

    this.form.valueChanges.subscribe((_) => {
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
    const control = new FormControl(null, Validators.required);

    this.form.addControl('name', control);
  }
}
