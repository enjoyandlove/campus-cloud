import { SNACKBAR_SHOW } from './../../../../reducers/snackbar.reducer';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../session';
import { AudienceType } from './../audience.status';
import { AudienceService } from '../audience.service';
import { ISnackbar } from '../../../../reducers/snackbar.reducer';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { BaseComponent } from '../../../../base';

@Component({
  selector: 'cp-audience-edit',
  templateUrl: './audience-edit.component.html',
  styleUrls: ['./audience-edit.component.scss']
})
export class AuidenceEditComponent extends BaseComponent implements OnInit {
  @Input() audienceId: number;

  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  loading;
  audience;
  buttonData;
  form: FormGroup;
  defaultAudienceView;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    private service: AudienceService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  doSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service.updateAudience(this.audienceId, this.form.value, search).subscribe(
      (_) => {
        $('#audienceEdit').modal('hide');
        this.edited.emit(this.form.value);
        this.resetModal();
      },
      () => {
        this.store.dispatch({
          type: SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: 'danger',
            body: this.cpI18n.translate('something_went_wrong')
          }
        });
      }
    );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
  }

  onAudienceSelected(userIds) {
    this.form.controls['user_ids'].setValue(userIds);
  }

  onFiltersSelected(filters) {
    this.form.controls['filters'].setValue(filters);
  }

  buildChips() {
    return this.audience.users.map((user) => {
      return {
        label: `${user.email}`,
        id: user.id
      };
    });
  }

  initCustom() {
    const userIds = this.audience.users.map((user) => user.id);
    this.form.addControl('user_ids', new FormControl(userIds, Validators.required));

    this.audience = Object.assign({}, this.audience, { users: this.buildChips() });
  }

  initDynamic() {
    const filters = this.audience.filters.map(({ attr_id, choices }) => {
      return {
        attr_id,
        choices
      };
    });

    this.form.addControl('filters', new FormControl(filters, Validators.required));
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getAudienceById(this.audienceId, search);

    super.fetchData(stream$).then((audience) => {
      this.audience = audience.data;

      this.form = this.fb.group({
        name: [this.audience.name, Validators.required]
      });

      this.form.valueChanges.subscribe(() => {
        this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
      });

      this.defaultAudienceView = this.audience.type;

      if (this.audience.type === AudienceType.custom) {
        this.initCustom();
      }

      if (this.audience.type === AudienceType.dynamic) {
        this.initDynamic();
      }
    });
  }

  ngOnInit() {
    this.fetch();

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('update')
    };
  }
}
