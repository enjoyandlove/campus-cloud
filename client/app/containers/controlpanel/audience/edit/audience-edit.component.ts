import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../session';
import { AudienceService } from '../audience.service';
import { CPI18nService } from './../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-audience-edit',
  templateUrl: './audience-edit.component.html',
  styleUrls: ['./audience-edit.component.scss']
})
export class AuidenceEditComponent implements OnInit {
  @Input() audience: any;
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  buttonData;
  chipOptions;
  form: FormGroup;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private service: AudienceService
  ) {}

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

    this.service.updateAudience(this.audience.id, this.form.value, search).subscribe(
      (_) => {
        $('#audienceEdit').modal('hide');
        this.edited.emit(this.form.value);
        this.resetModal();
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
  }

  onAudienceSelected(selected) {
    this.form.controls['user_ids'].setValue(selected);
  }

  buildChips() {
    return this.audience.users.map((user) => {
      return {
        label: `${user.email}`,
        id: user.id
      };
    });
  }

  ngOnInit() {
    this.chipOptions = {
      icon: 'account_box',
      withClose: true,
      withAvatar: true
    };

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('update')
    };

    this.audience = Object.assign({}, this.audience, { users: this.buildChips() });

    this.form = this.fb.group({
      name: [this.audience.name, Validators.required],
      user_ids: [this.audience.users, Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
