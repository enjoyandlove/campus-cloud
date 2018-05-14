import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IStore } from '../store.interface';
import { StoreService } from '../store.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'cp-store-create',
  templateUrl: './store-create.component.html',
  styleUrls: ['./store-create.component.scss']
})
export class StoreCreateComponent implements OnInit {
  @Output() created: EventEmitter<IStore> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
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
    // this.createForm.employerForm.reset();
    $('#createModal').modal('hide');
  }

  onSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service.createStore(this.storeForm.value, search).subscribe((store) => {
      this.created.emit(store);
      this.resetModal();
    });
  }

  ngOnInit() {
    this.storeForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(120)]],
      description: [null],
      logo_url: [null, Validators.required],
      website: [null],
      city: [null],
      location: [null],
      province: [null],
      country: [null],
      address: [null],
      postal_code: [null],
      latitude: [null],
      longitude: [null],
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
