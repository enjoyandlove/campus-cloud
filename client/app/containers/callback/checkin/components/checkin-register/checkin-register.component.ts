import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cp-checkin-register',
  templateUrl: './checkin-register.component.html',
  styleUrls: ['./checkin-register.component.scss'],
})
export class CheckinRegisterComponent implements OnInit {
  @Input() data: any;
  @Output() send: EventEmitter<any> = new EventEmitter();

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  onSubmit(data) {
    this.send.emit(data);
    this.registrationForm.reset();
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      email: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
    });
  }
}
