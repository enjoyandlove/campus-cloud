import { HttpParams } from '@angular/common/http';
import {
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
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { OrientationService } from '../orientation.services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants/privileges';
import { OrientationAmplitudeService } from '../orientation.amplitude.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-orientation-program-create',
  templateUrl: './orientation-program-create.component.html',
  styleUrls: ['./orientation-program-create.component.scss']
})
export class OrientationProgramCreateComponent implements OnInit, OnDestroy {
  @ViewChild('createForm', { static: true }) createForm;

  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  hasMembership = false;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public router: Router,
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: OrientationService,
    private cpTracking: CPTrackingService
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

    this.service
      .createProgram(this.form.value, search)
      .subscribe((createdOrientationProgram: any) => {
        this.resetModal();
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_CREATED_ITEM,
          OrientationAmplitudeService.getItemProperties(createdOrientationProgram)
        );
        this.router.navigate([`/manage/orientation/${createdOrientationProgram.id}/events`]);
      });
  }

  ngOnInit() {
    this.hasMembership = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation);
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)],
      has_membership: [this.hasMembership]
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
