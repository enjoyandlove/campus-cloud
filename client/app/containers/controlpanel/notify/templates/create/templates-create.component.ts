import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { TemplatesService } from './../templates.service';
import { CPSession } from './../../../../../session/index';
import { STATUS } from './../../../../../shared/constants/status';
import { StoreService } from './../../../../../shared/services/store.service';
import { AnnouncementsService } from './../../announcements/announcements.service';

import {
  AnnouncementsComposeComponent
} from './../../announcements/compose/announcements-compose.component';


declare var $;

@Component({
  selector: 'cp-templates-create',
  templateUrl: './templates-create.component.html',
  styleUrls: ['./templates-create.component.scss']
})
export class TemplatesCreateComponent extends AnnouncementsComposeComponent
  implements OnInit, OnDestroy {

    form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public storeService: StoreService,
    public service: AnnouncementsService,
    private childService: TemplatesService
  ) {
    super(fb, session, storeService, service);
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

    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    let data = {
      'store_id': this.form.value.store_id,
      'name': this.form.value.name,
      'is_school_wide': this.form.value.is_school_wide,
      'subject': this.form.value.subject,
      'message': this.form.value.message,
      'priority': this.form.value.priority
    };

    if (this.state.isToUsers && !this.state.isCampusWide) {
      data = Object.assign(
        {},
        data,
        { 'user_ids': this.form.value.user_ids }
      );
    }

    if (this.state.isToLists && !this.state.isCampusWide) {
      data = Object.assign(
        {},
        data,
        { 'list_ids': this.form.value.list_ids }
      );
    }

    this
      .childService
      .createTemplate(search, data)
      .subscribe(
      res => {
        console.log(res);
        this.form.reset();
        this.created.emit(this.form.value);
        this.resetModal();
      },
      _ => {
        this.isError = true;
        this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
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
    super.ngOnInit();
    const control = new FormControl(null, Validators.required);

    this.form.addControl('name', control);
  }
}
