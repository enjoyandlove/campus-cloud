import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'cp-members-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ClubsMembersEditComponent implements OnInit {
  @Input() member: any;
  @Output() memberEdited: EventEmitter<any> = new EventEmitter();

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
    console.log(this.member);
    this.form = this.fb.group({
      'firstname': [this.member.firstname, Validators.required],
      'lastname': [this.member.lastname, Validators.required],
      'fullname': [this.member.fullname, Validators.required],
      'member_type': [this.member.member_type, Validators.required],
      'position': [this.member.position],
      'description': [this.member.description],
      'avatar_url': [this.member.avatar_url]
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
