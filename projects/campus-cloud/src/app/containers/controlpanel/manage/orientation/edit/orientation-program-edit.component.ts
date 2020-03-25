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
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { baseActions } from '@campus-cloud/store/base';
import { OrientationService } from '../orientation.services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { OrientationUtilsService } from '../orientation.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { OrientationAmplitudeService } from '../orientation.amplitude.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-orientation-program-edit',
  templateUrl: './orientation-program-edit.component.html',
  styleUrls: ['./orientation-program-edit.component.scss']
})
export class OrientationProgramEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm', { static: true }) editForm;

  @Input() orientationProgram;

  @Output()
  edited: EventEmitter<{
    id: number;
    name: string;
    description: string;
  }> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  hasMembership = false;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    private store: Store<any>,
    public cpI18n: CPI18nService,
    public service: OrientationService,
    public utils: OrientationUtilsService,
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
    this.resetEditModal.emit();
    this.editForm.form.reset();
    $('#programEdit').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service
      .editProgram(this.orientationProgram.id, this.form.value, search)
      .subscribe((editedProgram: any) => {
        this.store.dispatch({
          type: baseActions.HEADER_UPDATE,
          payload: this.utils.buildHeader(editedProgram)
        });
        this.edited.emit(editedProgram);
        this.resetModal();
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_UPDATED_ITEM,
          OrientationAmplitudeService.getItemProperties(editedProgram)
        );
      });
  }

  ngOnInit() {
    this.hasMembership = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation);

    this.form = this.fb.group({
      name: [this.orientationProgram.name, [Validators.required, Validators.maxLength(225)]],
      description: [this.orientationProgram.description, Validators.maxLength(512)],
      has_membership: [this.orientationProgram.has_membership]
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
