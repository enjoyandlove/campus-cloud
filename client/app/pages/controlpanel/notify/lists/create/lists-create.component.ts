import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ListsService } from '../lists.service';

declare var $: any;

@Component({
  selector: 'cp-lists-create',
  templateUrl: './lists-create.component.html',
  styleUrls: ['./lists-create.component.scss']
})
export class ListsCreateComponent implements OnInit {
  @Output() created: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ListsService,
  ) { }

  doSubmit() {
    $('#listsCreate').modal('hide');
    this.created.emit(this.form.value);
    this.resetModal();
  }

  resetModal() {
    this.form.reset();
  }

  ngOnInit() {
    this.form = this.fb.group({
      'name': [null, Validators.required],
      'description': [null],
      'users': [null, Validators.required],
    });
  }
}
