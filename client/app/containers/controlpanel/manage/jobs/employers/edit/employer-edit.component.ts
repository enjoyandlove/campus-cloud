import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { IEmployer } from '../employer.interface';
import { EmployerService } from '../employer.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-employer-edit',
  templateUrl: './employer-edit.component.html',
  styleUrls: ['./employer-edit.component.scss']
})
export class EmployerEditComponent implements OnInit {
  @ViewChild('editForm') editForm;

  @Input() employer: IEmployer;

  @Output() edited: EventEmitter<IEmployer> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  employerForm: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EmployerService
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
    this.editForm.employerForm.reset();
    $('#editModal').modal('hide');
  }

  onSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .editEmployer(this.employer.id, this.employerForm.value, search)
      .subscribe((employer) => {
        this.edited.emit(employer);
        this.resetModal();
      });
  }

  ngOnInit() {
    this.employerForm = this.fb.group({
      id: [this.employer.id],
      name: [this.employer.name, [Validators.required, Validators.maxLength(110)]],
      description: [this.employer.description],
      logo_url: [this.employer.logo_url, Validators.required],
      email: [this.employer.email]
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('save')
    });

    this.employerForm.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.employerForm.valid };
    });
  }
}
