import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { IStore } from '../store.interface';
import { StoreService } from '../store.service';

@Component({
  selector: 'cp-store-create',
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit {
  @Output() created: EventEmitter<IStore> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  errorMessage;
  error = false;
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
    this.resetCreateModal.emit();
    $('#createModal').modal('hide');
  }

  onSubmit() {
    this.error = false;
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createStore(this.storeForm.value, search).subscribe(
      (store: any) => {
        this.created.emit(store);
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
      name: [null, [Validators.required, Validators.maxLength(120)]],
      logo_url: [null, Validators.required],
      description: [null],
      website: [null],
      address: [null],
      city: [null],
      province: [null],
      country: [null],
      postal_code: [null],
      latitude: [this.session.g.get('school').latitude],
      longitude: [this.session.g.get('school').longitude]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    });

    this.storeForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.storeForm.valid };
    });
  }
}
