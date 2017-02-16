import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'cp-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      'title': ['', Validators.required],
      'store_id': ['', Validators.required],
      'location': ['', Validators.required],
      'room_data': ['', Validators.required],
      'address': ['', Validators.required],
      'start': ['', Validators.required],
      'end': ['', Validators.required],
      'description': ['', Validators.required],
      'attend_verification_methods': ['']
    });
  }

  ngOnInit() { }
}
