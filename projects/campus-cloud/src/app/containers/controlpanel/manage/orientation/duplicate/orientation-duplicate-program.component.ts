import {
  Input,
  OnInit,
  Output,
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { OrientationService } from '../orientation.services';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';

@Mixin([Destroyable])
@Component({
  selector: 'cp-orientation-duplicate-program',
  templateUrl: './orientation-duplicate-program.component.html',
  styleUrls: ['./orientation-duplicate-program.component.scss']
})
export class OrientationDuplicateProgramComponent implements OnInit, OnDestroy {
  @ViewChild('duplicateForm', { static: true }) duplicateForm;

  @Input() orientationProgram;

  @Output() resetDuplicateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  isOrientation = true;
  hasMembership = false;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public router: Router,
    public session: CPSession,
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
    this.resetDuplicateModal.emit();
    this.duplicateForm.form.reset();
    $('#programDuplicate').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.duplicateProgram(this.form.value, search).subscribe((duplicateProgram: any) => {
      this.resetModal();
      this.router.navigate([`/manage/orientation/${duplicateProgram.id}/events`]);
    });
  }

  ngOnInit() {
    this.hasMembership = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation);

    const { name, description, has_membership } = this.orientationProgram;
    this.form = this.fb.group({
      clone_calendar_id: [this.orientationProgram.id],
      name: [
        `${this.cpI18n.translate('t_copy_of')} ${name}`,
        [Validators.required, Validators.maxLength(225)]
      ],
      description: [description, Validators.maxLength(512)],
      has_membership: [has_membership]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: !this.form.valid,
      text: this.cpI18n.translate('save')
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
