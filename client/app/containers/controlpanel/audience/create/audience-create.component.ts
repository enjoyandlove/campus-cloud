import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../session';
import { AudienceService } from '../audience.service';
import { STATUS } from '../../../../shared/constants';
import { CPI18nService } from './../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-create',
  templateUrl: './audience-create.component.html',
  styleUrls: ['./audience-create.component.scss']
})
export class AudienceCreateComponent implements OnInit, OnDestroy {
  @Input() users: Array<any> = [];
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<any> = new EventEmitter();

  isError;
  buttonData;
  errorMessage;
  userCount = 0;
  form: FormGroup;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private service: AudienceService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  onUserCount(userCount) {
    this.userCount = userCount;
    this.buttonData = { ...this.buttonData, disabled: !this.validate() };
  }

  doSubmit() {
    this.isError = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.createAudience(this.form.value, search).subscribe(
      (_) => {
        this.created.emit(this.form.value);
        this.resetModal();
      },
      (err) => {
        this.isError = true;
        const error = JSON.parse(err._body).error;
        if (error === 'Database Error') {
          this.errorMessage = this.cpI18n.translate('audience_create_error_duplicate_audience');

          return;
        }
        this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
      }
    );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
    this.userCount = 0;
    this.isError = false;
    $('#audienceCreate').modal('hide');
  }

  onAudienceSelected(userIds: Array<number>) {
    this.userCount = userIds.length;
    this.form.controls['user_ids'].setValue(userIds);

    this.buttonData = { ...this.buttonData, disabled: !this.validate() };
  }

  onFiltersSelected(filters) {
    this.form.controls['filters'].setValue(filters);
  }

  onAudienceTypeChange({ custom, dynamic }) {
    this.userCount = 0;

    if (custom) {
      this.form.addControl('user_ids', new FormControl(null, Validators.required));
      this.form.removeControl('filters');
    }
    if (dynamic) {
      this.form.addControl('filters', new FormControl(null, Validators.required));
      this.form.removeControl('user_ids');
    }

    this.buttonData = { ...this.buttonData, disabled: !this.validate() };
  }

  validate() {
    return this.form.valid && this.userCount > 0;
  }

  ngOnDestroy() {
    this.resetModal();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.validate() };
    });

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    };
  }
}
