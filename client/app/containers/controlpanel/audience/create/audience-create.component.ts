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
import { URLSearchParams } from '@angular/http';
import { get as _get } from 'lodash';

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

  doSubmit() {
    this.isError = false;
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service.createAudience(this.form.value, search).subscribe(
      (_) => {
        this.created.emit(this.form.value);
        this.resetModal();
      },
      (err) => {
        this.isError = true;
        const error = JSON.parse(err._body).error;
        if (error === 'Database Error') {
          this.errorMessage = 'An audience with that name already exists';

          return;
        }
        this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
      }
    );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
    this.isError = false;
    $('#audienceCreate').modal('hide');
  }

  onAudienceSelected(userIds) {
    this.form.controls['user_ids'].setValue(userIds);
  }

  onFiltersSelected(filters) {
    this.form.controls['filters'].setValue(filters);
  }

  onAudienceTypeChange({ custom, dynamic }) {
    if (custom) {
      this.form.addControl('user_ids', new FormControl(null, Validators.required));
      this.form.removeControl('filters');
    }
    if (dynamic) {
      this.form.addControl('filters', new FormControl(null, Validators.required));
      this.form.removeControl('user_ids');
    }
  }

  validate() {
    let validaName = false;
    let validaUsersIds = true;
    let validaFilters = true;

    const filters = _get(this.form.controls.filters, 'value', false);
    const user_ids = _get(this.form.controls.user_ids, 'value', false);

    validaName = !!this.form.controls['name'].value;

    if (user_ids) {
      validaUsersIds = this.form.controls['user_ids'].value;
    }

    if (filters) {
      const control = this.form.controls['filters'];

      if (control.value) {
        control.value.forEach((filter) => {
          if (!filter['attr_id'] || !filter['choices'].length) {
            validaFilters = false;
          }
        });
      }
    }

    return validaName && validaUsersIds && validaFilters && (filters || user_ids);
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
