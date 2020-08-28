import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';
import { READY_MODAL_DATA } from '@ready-education/ready-ui/overlays';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-health-pass-edit',
  templateUrl: './health-pass-edit.component.html',
  styleUrls: ['./health-pass-edit.component.scss']
})
export class HealthPassEditComponent implements OnInit {

  form: FormGroup;
  healthPass: IHealthPass;
  envRootPath = environment.root;

  constructor(private formBuilder: FormBuilder,
              @Inject(READY_MODAL_DATA) public modal) {

    this.healthPass = modal.data;
    this.form = this.formBuilder.group({
        name: this.formBuilder.control(this.modal.data.name, Validators.compose([
          Validators.required,
          Validators.maxLength(255)
        ])),
        description: this.formBuilder.control(this.modal.data.description, Validators.compose([
          Validators.required,
          Validators.maxLength(2048)
        ]))
      }
    );
  }

  ngOnInit(): void {
  }

  onSave() {
    this.healthPass = { ...this.healthPass, ...this.form.value};
    this.modal.onAction(this.healthPass);
  }
}
