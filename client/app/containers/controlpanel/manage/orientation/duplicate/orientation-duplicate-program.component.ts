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
// import { URLSearchParams } from '@angular/http';

import { OrientationService } from '../orientation.services';

@Component({
  selector: 'cp-orientation-duplicate-program',
  templateUrl: './orientation-duplicate-program.component.html',
  styleUrls: ['./orientation-duplicate-program.component.scss'],
})
export class OrientationDuplicateProgramComponent implements OnInit {
  @ViewChild('duplicateForm') duplicateForm;

  @Input() orientationProgram;
  @Input() isOrientation = false;

  @Output()
  created: EventEmitter<{
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
    this.duplicateForm.form.reset();
    $('#programDuplicate').modal('hide');
  }

  onSubmit() {
   // const search = new URLSearchParams();
    /*search.append('school_id', this.session.g.get('school').id);

    this.service
      .duplicateOrientationProgram(programId, this.form.value, search)
      .subscribe(() => {
        // todo: redirect to event page when program created
        // this.created.emit(createdOrientationProgram);
        // this.resetModal();
      });*/
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)],
      is_membership: [1],
    });
  }
}
