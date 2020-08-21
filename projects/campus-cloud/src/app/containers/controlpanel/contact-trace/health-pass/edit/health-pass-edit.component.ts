import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';

@Component({
  selector: 'cp-health-pass-edit',
  templateUrl: './health-pass-edit.component.html',
  styleUrls: ['./health-pass-edit.component.scss']
})
export class HealthPassEditComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<HealthPassEditComponent>,
              @Inject(MAT_DIALOG_DATA) private data: IHealthPass) {

    this.form = this.formBuilder.group({
        name: this.formBuilder.control(this.data.name, Validators.required),
        description: this.formBuilder.control(this.data.description, Validators.required)
      }
    );
  }

  ngOnInit(): void {
  }

  onSave() {

  }
}
