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

import { URLSearchParams } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from '../../../../session';
import { AudienceService } from '../audience.service';
import { STATUS } from '../../../../shared/constants';
import { CPI18nService } from './../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-create',
  templateUrl: './audience-create.component.html',
  styleUrls: ['./audience-create.component.scss']
})
export class AduienceCreateComponent implements OnInit, OnDestroy {
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

    const data = Object.assign({}, this.form.value);

    this.service.createAudience(data, search).subscribe(
      (_) => {
        this.created.emit(data);
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

  ngOnDestroy() {
    this.resetModal();
  }

  onAudienceSelected(selected) {
    this.form.controls['user_ids'].setValue(selected);
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      user_ids: [null, Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });

    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    };
  }
}
