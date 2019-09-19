import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators';
import { BehaviorSubject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { StoreService } from '@campus-cloud/shared/services';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { StudentsService } from './../students.service';
import { CPI18nService } from '@campus-cloud/shared/services/i18n.service';

const THROTTLED_STATUS = 1;

declare var $;

@Component({
  selector: 'cp-students-compose',
  templateUrl: './students-compose.component.html',
  styleUrls: ['./students-compose.component.scss']
})
export class StudentsComposeComponent implements OnInit {
  @Input() fromDisabled = false;
  @Input() props: { name: string; userIds: Array<number>; storeId: number };

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() success: EventEmitter<{ hostType: string }> = new EventEmitter();

  isError;
  stores$;
  hostType;
  buttonData;
  sendAsName;
  errorMessage;
  selectedStore;
  form: FormGroup;
  resetStores$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: StudentsService,
    private storeService: StoreService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  doSubmit() {
    let data = this.form.value;
    this.isError = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    data = {
      ...data,
      message: `${data.message} \n ${this.sendAsName}`
    };

    this.service.postAnnouncements(search, data).subscribe(
      (res: any) => {
        if (res.status === THROTTLED_STATUS) {
          this.isError = true;
          this.errorMessage = `Message not sent, \n
          please wait ${(res.timeout / 60).toFixed()} minutes before trying again`;

          return;
        }
        this.success.emit({ hostType: this.hostType });
        this.resetModal();
        $('#studentsComposeModal').modal('hide');
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

  loadStores() {
    const school = this.session.g.get('school');
    const search: HttpParams = new HttpParams().append('school_id', school.id.toString());

    /**
     * avoid updatating the dropdown when
     * we get both defaultHost and storeId
     */
    this.selectedStore = this.props.storeId ? null : this.session.defaultHost;

    this.stores$ = this.storeService
      .getStores(search, {
        label: '---',
        value: null,
        heading: true
      })
      .pipe(
        tap((stores) => {
          if (this.props.storeId) {
            this.getSelectedStore(stores);
          }
        })
      );
  }

  getSelectedStore(stores) {
    const selectedStore = stores.find((s) => s.value === this.props.storeId);

    if (selectedStore) {
      this.selectedStore = selectedStore;
      this.sendAsName = selectedStore.label;
      this.hostType = this.selectedStore.hostType;
    }

    return selectedStore;
  }

  ngOnInit() {
    this.hostType = this.session.defaultHost ? this.session.defaultHost.hostType : null;
    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    if (defaultHost) {
      this.sendAsName = this.session.defaultHost.label;
    }

    this.loadStores();

    this.form = this.fb.group({
      user_ids: [this.props.userIds],
      is_school_wide: false,
      store_id: [this.props.storeId ? this.props.storeId : defaultHost, Validators.required],
      subject: [
        null,
        [Validators.required, Validators.maxLength(128), CustomValidators.requiredNonEmpty]
      ],
      message: [
        null,
        [Validators.required, Validators.maxLength(400), CustomValidators.requiredNonEmpty]
      ],
      priority: [2, Validators.required]
    });

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('send')
    };

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
