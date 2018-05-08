import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from './../../../../../session';
import { ProgramMembership } from '../orientation.status';
import { OrientationService } from '../orientation.services';
import { CPI18nService } from '../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-orientation-program-create',
  templateUrl: './orientation-program-create.component.html',
  styleUrls: ['./orientation-program-create.component.scss']
})
export class OrientationProgramCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  isOrientation = true;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public router: Router,
    public cpI18n: CPI18nService,
    public service: OrientationService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetCreateModal.emit();
    this.createForm.form.reset();
    $('#programCreate').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createProgram(this.form.value, search).subscribe((createdOrientationProgram) => {
      this.resetModal();
      this.router.navigate([`/manage/orientation/${createdOrientationProgram.id}/events`]);
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)],
      has_membership: [ProgramMembership.enabled]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: !this.form.valid,
      text: this.cpI18n.translate('save')
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
