/* tslint:disable:max-line-length */
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CPSession } from './../../../../../session/index';
import { StoreService, CPI18nService } from './../../../../../shared/services';
import { AnnouncementsService } from './../../announcements/announcements.service';

import { AnnouncementsComposeComponent } from './../../announcements/compose/announcements-compose.component';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';

@Component({
  selector: 'cp-templates-compose',
  templateUrl: './templates-compose.component.html',
  styleUrls: ['./templates-compose.component.scss'],
})
export class TemplatesComposeComponent extends AnnouncementsComposeComponent
  implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() toolTipContent: IToolTipContent;

  selectedHost;
  form: FormGroup;

  constructor(
    private el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: StoreService,
    public service: AnnouncementsService,
  ) {
    super(fb, session, cpI18n, storeService, service);
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
    this.selectedType = super.getObjectFromTypesArray(type.action);
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
    super.resetModal();
  }

  onHandleToggle(status) {
    super.onHandleToggle(status);
  }

  onSelectedStore(store) {
    super.onSelectedStore(store);
  }

  doValidate() {
    super.doValidate();
  }

  doSubmit() {
    super.doSubmit();
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

  onChipSelection(chips) {
    super.onChipSelection(chips);
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

  updateStateFromInputData() {
    this.state = Object.assign({}, this.state, {
      isToLists: 'list_details' in this.data,
      isToUsers: 'user_details' in this.data,
      isCampusWide: this.data.is_school_wide,
      isUrgent: this.data.priority === this.URGENT_TYPE,
      isEmergency: this.data.priority === this.EMERGENCY_TYPE,
    });
  }

  updateLabel() {
    switch (this.data.priority) {
      case this.EMERGENCY_TYPE:
        this.subject_prefix = {
          label: this.cpI18n.translate('emergency'),
          type: 'danger',
        };
        break;
      case this.URGENT_TYPE:
        this.subject_prefix = {
          label: this.cpI18n.translate('urgent'),
          type: 'warning',
        };
        break;
      default:
        this.subject_prefix = {
          label: null,
          type: null,
        };
        break;
    }

    this.selectedType = super.getObjectFromTypesArray(this.data.priority);
  }

  updateFormWithTemplateData() {
    this.form.controls['subject'].setValue(this.data.subject);
    this.form.controls['priority'].setValue(this.data.priority);
    this.form.controls['message'].setValue(this.data.message);
    this.form.controls['store_id'].setValue(this.data.store_id);
    this.form.controls['is_school_wide'].setValue(this.data.is_school_wide);

    if ('list_details' in this.data) {
      const list_ids = this.data.list_details.map((list) => list.id);
      this.form.controls['list_ids'].setValue(list_ids);
    }

    if ('user_details' in this.data) {
      const user_ids = this.data.user_details.map((user) => user.id);
      this.form.controls['user_ids'].setValue(user_ids);
    }
  }

  updateTypeAheadDefaultValues() {
    this.typeAheadOpts.isUsers = 'user_details' in this.data;

    if ('list_details' in this.data) {
      this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, {
        defaultValues: this.data.list_details.map((list) => {
          return {
            id: list.id,
            label: list.name,
          };
        }),
      });
    }

    if ('user_details' in this.data) {
      this.typeAheadOpts = Object.assign({}, this.typeAheadOpts, {
        defaultValues: this.data.user_details.map((user) => {
          return {
            id: user.id,
            label: user.email,
          };
        }),
      });
    }
  }

  ngOnInit() {
    this.toolTipContent = Object.assign({}, this.toolTipContent, {
      content: this.cpI18n.translate('notify_announcement_template_to_tooltip'),
      link: {
        text: this.cpI18n.translate('lists_button_create'),
        url:
          'https://oohlalamobile.zendesk.com/hc/en-us/articles/' +
          '115004330554-Create-a-List-of-Students',
      },
    });
    super.ngOnInit();

    this.updateLabel();
    this.updateStateFromInputData();
    this.updateFormWithTemplateData();
    this.updateTypeAheadDefaultValues();

    this.sendAsName = this.data.store_name;

    this.selectedHost = {
      label: this.data.store_name,
      value: this.data.store_id,
    };
  }
}
