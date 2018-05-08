import { CPSession } from './../../../../../session/index';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

import { CalendarsService } from '../calendars.services';

@Component({
  selector: 'cp-calendars-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CalendarsCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

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
    public service: CalendarsService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.createForm.form.reset();
    $('#calendarsCreate').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createCalendar(this.form.value, search).subscribe((createdCalendar) => {
      this.created.emit(createdCalendar);
      this.resetModal();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)]
    });
  }
}
