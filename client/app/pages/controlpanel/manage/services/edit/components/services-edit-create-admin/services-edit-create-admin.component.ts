import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CP_PRIVILEGES_MAP } from '../../../../../../../shared/utils/privileges';
import { AdminService } from '../../../../../../../shared/services/admin.service';

@Component({
  selector: 'cp-services-edit-create-admin',
  templateUrl: './services-edit-create-admin.component.html',
  styleUrls: ['./services-edit-create-admin.component.scss']
})
export class ServicesEditCreateAdminComponent implements OnInit {
  @Input() storeId: number;
  @Output() created: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) { }

  onSubmit(data) {
    this
      .adminService
      .createAdmin(data)
      .subscribe(
        res => {
          this.created.emit(res);
          this.form.reset();
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
    this.form = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'email': [null, Validators.required],
      'account_level_privileges': [
        {
          [this.storeId]: {
            [CP_PRIVILEGES_MAP.services]: {
              r: true,
              w: true
            }
          }
        }
      ]
    });
  }
}
