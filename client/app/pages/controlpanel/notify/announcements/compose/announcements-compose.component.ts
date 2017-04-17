import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-announcements-compose',
  templateUrl: './announcements-compose.component.html',
  styleUrls: ['./announcements-compose.component.scss']
})
export class AnnouncementsComposeComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  doSubmit() {
    console.log(this.form.value);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'school_id': [157, Validators.required],
      'user_id': [157, Validators.required],
      'store_id': [157, Validators.required],
      'subject': [null, Validators.required],
      'message': [null, Validators.required],
      'priority': [null, Validators.required],
    });
  }
}
