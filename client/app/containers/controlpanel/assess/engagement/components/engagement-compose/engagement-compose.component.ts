import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from '../../../../../../session';
import { EngagementService } from './../../engagement.service';
import { StoreService } from '../../../../../../shared/services';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

const THROTTLED_STATUS = 1;

declare var $;

@Component({
  selector: 'cp-engagement-compose',
  templateUrl: './engagement-compose.component.html',
  styleUrls: ['./engagement-compose.component.scss']
})
export class EngagementComposeComponent implements OnInit {
  @Input() props: { name: string; userIds: Array<number> };
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() success: EventEmitter<{ hostType: string; props: any }> = new EventEmitter();

  isError;
  stores$;
  hostType;
  sendAsName;
  errorMessage;
  form: FormGroup;
  resetStores$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: EngagementService,
    private storeService: StoreService
  ) {
    const school = this.session.g.get('school');
    const search = new HttpParams().append('school_id', school.id.toString());

    this.stores$ = this.storeService.getStores(search);
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  doSubmit() {
    const hostType = this.hostType;
    let data = this.form.value;
    const props = this.props;
    this.isError = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    data = Object.assign({}, data, {
      message: `${data.message} ${this.sendAsName}`
    });

    this.service.postAnnouncements(search, data).subscribe(
      (res: any) => {
        if (res.status === THROTTLED_STATUS) {
          this.isError = true;
          this.errorMessage = `Message not sent, \n
          please wait ${(res.timeout / 60).toFixed()} minutes before trying again`;

          return;
        }
        this.resetModal();
        this.success.emit({ hostType, props });
        $('#composeModal').modal('hide');
      },
      (_) => {
        this.isError = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  onSelectedHost(host) {
    this.form.controls['store_id'].setValue(host.value);
    this.sendAsName = host.label;
    this.hostType = host.hostType;
  }

  resetModal() {
    this.form.reset();
    this.teardown.emit();
    this.resetStores$.next(true);
  }

  ngOnInit() {
    this.hostType = this.session.defaultHost ? this.session.defaultHost.hostType : null;
    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    this.form = this.fb.group({
      user_ids: [this.props.userIds],
      is_school_wide: false,
      store_id: [defaultHost, Validators.required],
      subject: [null, [Validators.required, Validators.maxLength(128)]],
      message: [null, [Validators.required, Validators.maxLength(400)]],
      priority: [2, Validators.required]
    });
  }
}
