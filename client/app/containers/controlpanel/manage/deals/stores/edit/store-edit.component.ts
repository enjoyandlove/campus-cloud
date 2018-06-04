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
import { HttpParams } from '@angular/common/http';

import { IStore } from '../store.interface';
import { StoreService } from '../store.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-store-edit',
  templateUrl: './store-edit.component.html',
  styleUrls: ['./store-edit.component.scss']
})
export class StoreEditComponent implements OnInit {
  @Input() store: IStore;

  @Output() edited: EventEmitter<IStore> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  error;
  buttonData;
  errorMessage;
  storeForm: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: StoreService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetEditModal.emit();
    $('#editModal').modal('hide');
  }

  onSubmit() {
    this.error = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.editStore(this.store.id, this.storeForm.value, search).subscribe(
      (store) => {
        this.edited.emit(store);
        this.resetModal();
      },
      () => {
        this.error = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  ngOnInit() {
    this.storeForm = this.fb.group({
      name: [this.store.name, [Validators.required, Validators.maxLength(120)]],
      description: [this.store.description],
      logo_url: [this.store.logo_url, Validators.required],
      city: [this.store.city],
      address: [this.store.address],
      province: [this.store.province],
      country: [this.store.country],
      postal_code: [this.store.postal_code],
      website: [this.store.website],
      latitude: [this.store.latitude],
      longitude: [this.store.longitude]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    });

    this.storeForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.storeForm.valid };
    });
  }
}
