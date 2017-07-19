import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../../session';
import { STATUS } from '../../../../../../shared/constants';
import { StoreService } from '../../../../../../shared/services';

const THROTTLED_STATUS = 1;

declare var $;

@Component({
  selector: 'cp-engagement-compose',
  templateUrl: './engagement-compose.component.html',
  styleUrls: ['./engagement-compose.component.scss']
})
export class EngagementComposeComponent implements OnInit {
  @Input() props: { 'label': string, 'users': Array<number> };
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  isError;
  stores$;
  errorMessage;
  form: FormGroup;
  resetStores$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private storeService: StoreService
  ) {
    const school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    this.stores$ = this.storeService.getStores(search);
  }

  doSubmit() {
    this.isError = false;
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    // this
    //   .service
    //   .postAnnouncements(search, data)
    //   .subscribe(
    //   res => {
    //     if (res.status === THROTTLED_STATUS) {
    //       this.isError = true;
    //       this.errorMessage = `Message not sent, \n
    //       please wait ${(res.timeout / 60).toFixed()} minutes before trying again`;
    //       return;
    //     }
    //     this.resetModal();
    //     $('#composeModal').modal('hide');
    //   },
    //   _ => {
    //     this.isError = true;
    //     this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
    //   }
    //   );
  }

  onSelectedHost(host) {
    this.form.controls['store_id'].setValue(host.value);
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
    this.resetStores$.next(true);
  }

  ngOnInit() {
    this.form = this.fb.group(
      {
        'user_ids': [[]],
        'is_school_wide': false,
        'store_id': [null, Validators.required],
        'subject': [null, [Validators.required, Validators.maxLength(128)]],
        'message': [null, [Validators.required, Validators.maxLength(400)]],
        'priority': [2, Validators.required]
      }
    );

    this.form.controls['user_ids'].setValue([1, 2, 3]);
  }
}
