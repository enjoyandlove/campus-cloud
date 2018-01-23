/* tslint:disable:max-line-length */
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef, Input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { TemplatesService } from './../templates.service';
import { CPSession } from './../../../../../session/index';
import { CPI18nService, StoreService } from './../../../../../shared/services';
import { AnnouncementsService } from './../../announcements/announcements.service';

import { AnnouncementsComposeComponent } from './../../announcements/compose/announcements-compose.component';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';

declare var $;

@Component({
  selector: 'cp-templates-create',
  templateUrl: './templates-create.component.html',
  styleUrls: ['./templates-create.component.scss'],
})
export class TemplatesCreateComponent extends AnnouncementsComposeComponent
  implements OnInit, OnDestroy {
  @Input() toolTipContent: IToolTipContent;

  form: FormGroup;

  constructor(
    private el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: StoreService,
    public service: AnnouncementsService,
    private childService: TemplatesService,
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
      type: null,
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

    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    let data = {
      store_id: this.form.value.store_id,
      name: this.form.value.name,
      is_school_wide: this.form.value.is_school_wide,
      subject: this.form.value.subject,
      message: this.form.value.message,
      priority: this.form.value.priority,
    };

    if (this.state.isToUsers && !this.state.isCampusWide) {
      data = Object.assign({}, data, { user_ids: this.form.value.user_ids });
    }

    if (this.state.isToLists && !this.state.isCampusWide) {
      data = Object.assign({}, data, { list_ids: this.form.value.list_ids });
    }

    this.childService.createTemplate(search, data).subscribe(
      () => {
        this.form.reset();
        this.created.emit(this.form.value);
        this.resetModal();
      },
      (_) => {
        this.isError = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      },
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
    this.toolTipContent = Object.assign({}, this.toolTipContent, {
      content: this.cpI18n.translate('notify_announcement_template_to_tooltip'),
      link: {
        text: this.cpI18n.translate('lists_button_create'),
        url: 'https://oohlalamobile.zendesk.com/hc/en-us/articles/' +
        '115004330554-Create-a-List-of-Students',
      }
    });

    super.ngOnInit();
    const control = new FormControl(null, Validators.required);

    this.form.addControl('name', control);
  }
}
