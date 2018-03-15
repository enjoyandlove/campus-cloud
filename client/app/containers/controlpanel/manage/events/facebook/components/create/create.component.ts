import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { EventsService } from '../../../events.service';
import { CPSession } from '../../../../../../../session';
import { CPI18nService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-facebook-events-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class FacebookEventsCreateComponent implements OnInit {
  @Input() clubId: number;
  @Input() storeId: number;
  @Input() orientationId: number;
  @Input() stores: Array<any>;
  @Output() created: EventEmitter<null> = new EventEmitter();

  errors = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private eventsService: EventsService,
  ) {}

  onSubmit(data) {
    this.errors = [];
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.eventsService.createFacebookEvent(data, search).subscribe(
      (_) => {
        this.form.reset();
        this.created.emit();
      },
      (err) => {
        if (err.status === 400) {
          this.errors.push(this.cpI18n.translate('duplicate_entry'));

          return;
        }
      },
    );
  }

  onSelectedStore(host) {
    this.form.controls['store_id'].setValue(host.value);
  }

  ngOnInit() {
    let store_id = this.session.defaultHost
      ? this.session.defaultHost.value
      : null;

    if (this.storeId) {
      store_id = this.storeId;
    }

    if (this.clubId) {
      store_id = this.clubId;
    }

    this.form = this.fb.group({
      url: [null, Validators.required],
      store_id: [store_id ? store_id : null, Validators.required],
    });
  }
}
