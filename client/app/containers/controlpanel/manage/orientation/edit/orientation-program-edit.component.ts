import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { OrientationService } from '../orientation.services';

@Component({
  selector: 'cp-orientation-program-edit',
  templateUrl: './orientation-program-edit.component.html',
  styleUrls: ['./orientation-program-edit.component.scss'],
})
export class OrientationProgramEditComponent implements OnInit {
  @ViewChild('editForm') editForm;

  @Input() orientationProgram;
  @Input() isOrientation = false;

  @Output()
  edited: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
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
    $('#programEdit').modal('hide');
  }

  onSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .editOrientationProgram(this.orientationProgram.id, this.form.value, search)
      .subscribe((editedProgram) => {
        this.edited.emit(editedProgram);
        this.resetModal();
      });
    this.edited.emit(this.editForm.form.value);
    this.resetModal();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        this.orientationProgram.name,
        [Validators.required, Validators.maxLength(225)],
      ],
      description: [
        this.orientationProgram.description,
        Validators.maxLength(512)
      ],
      is_membership: [
        this.orientationProgram.is_membership
      ],
    });
  }
}
