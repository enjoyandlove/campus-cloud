import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-facebook-events-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class FacebookEventsCreateComponent implements OnInit {
  @Input() stores: Array<any>;
  @Output() eventCreate: EventEmitter<any> = new EventEmitter();
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  onSubmit(data) {
    console.log(data);
    this.eventCreate.emit();
  }

  onSelectedStore(host) {
    this.form.controls['store_id'].setValue(host.action);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'url': [null, Validators.required],
      'store_id': [null, Validators.required]
    });
  }
}
