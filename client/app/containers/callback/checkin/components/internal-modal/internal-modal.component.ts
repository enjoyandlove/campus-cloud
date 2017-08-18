import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cp-checkin-internal-modal',
  templateUrl: './internal-modal.component.html',
  styleUrls: ['./internal-modal.component.scss']
})
export class CheckinInternalModalComponent implements OnInit {
  @Input() data: any;
  @Input() isEvent: boolean;
  @Input() isService: boolean;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() updated: EventEmitter<any> = new EventEmitter();

  name;
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  resetModal() {
    this.teardown.emit();
  }

  onSubmit() {
    let data = this.form.value;

    if (this.isEvent) {
      delete data['provider_name'];
    }

    this.updated.emit(data);
    this.teardown.emit();
  }

  ngOnInit() {
    this.name = this.isService ? 'service_name' : 'title';

    this.form = this.fb.group({
      [this.name]: [this.data[this.name]],
      'provider_name': [this.data.provider_name || null],
      'school_name': [this.data.school_name]
    });
  }
}
