import { CPSession } from './../../../../../session/index';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild, Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { OrientationService } from '../orientation.services';
import { CPI18nService } from '../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-orientation-duplicate-program',
  templateUrl: './orientation-duplicate-program.component.html',
  styleUrls: ['./orientation-duplicate-program.component.scss'],
})
export class OrientationDuplicateProgramComponent implements OnInit {
  @ViewChild('duplicateForm') duplicateForm;

  @Input() orientationProgram;

  @Output()
  created: EventEmitter<{
    id: number;
    name: string;
    description: string;
    is_membership: number;
  }> = new EventEmitter();
  @Output() resetDuplicateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  isOrientation = true;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: OrientationService,
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
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .duplicateOrientationProgram(this.orientationProgram.id, this.form.value, search)
      .subscribe((duplicateProgram) => {
        // todo: redirect to event page when program created
        this.created.emit(duplicateProgram);
        this.resetModal();
      });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.orientationProgram.id],
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)],
      is_membership: [this.orientationProgram.is_membership],
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
