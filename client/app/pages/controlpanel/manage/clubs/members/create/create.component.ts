import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'cp-members-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ClubsMembersCreateComponent implements OnInit {
  @Output() memberCreated: EventEmitter<any> = new EventEmitter();

  formErrors;
  memberTypes;
  isExec = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  onTypeChange(type): void {
    let control = this.form.controls['member_type'];
    control.setValue(type);

    this.isExec = control.value.action === 1;
  }

  onUploadedImage(image) {
    this.form.controls['avatar_url'].setValue(image);
  }

  onSave() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      return;
    }
    console.log(this.form.value);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'fullname': [null, Validators.required],
      'member_type': [null, Validators.required],
      'position': [null],
      'description': [null],
      'avatar_url': [null]
    });

    this.memberTypes = [
      {
        label: 'Member',
        action: 0
      },
      {
        label: 'Executive',
        action: 1
      }
    ];
  }
}
