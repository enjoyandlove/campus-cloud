import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CPSession } from './../../../../../session/index';
import { StoreService } from './../../../../../shared/services/store.service';
import { AnnouncementsService } from './../../announcements/announcements.service';

import {
  AnnouncementsComposeComponent
} from './../../announcements/compose/announcements-compose.component';

@Component({
  selector: 'cp-templates-compose',
  templateUrl: './templates-compose.component.html',
  styleUrls: ['./templates-compose.component.scss']
})
export class TemplatesComposeComponent extends AnnouncementsComposeComponent
  implements OnInit, OnDestroy {

  @Input() data: any;

  form: FormGroup;
  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public storeService: StoreService,
    public service: AnnouncementsService
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
    super.resetModal();
  }

  onHandleToggle(status) {
    super.onHandleToggle(status);
  }

  onSelectedStore(store) {
    super.onSelectedStore(store);
  }

  doValidate() {
    if (this.state.isEmergency || this.state.isCampusWide) {
      this.shouldConfirm = true;
      return;
    }
    this.doSubmit();
  }

  doSubmit() {
    console.log(this.form.value);
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

  updateFormWithTemplateData() {
    this.form.controls['subject'].setValue(this.data.subject);
    this.form.controls['template_name'].setValue(this.data.name);
    this.form.controls['message'].setValue(this.data.body);
  }

  ngOnInit() {
    super.ngOnInit();

    const control = new FormControl(null, Validators.required);

    this.form.addControl('template_name', control);

    this.updateFormWithTemplateData();
  }
}
