import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';

declare var $: any;

@Component({
  selector: 'cp-lists-edit',
  templateUrl: './lists-edit.component.html',
  styleUrls: ['./lists-edit.component.scss']
})
export class ListsEditComponent implements OnInit {
  @Input() list: any;
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  chipOptions;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private service: ListsService,
  ) { }

  doSubmit() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    let data = Object.assign(
      {},
      this.form.value,
      {
        user_ids: this.form.value.user_ids.map(user => user.id)
      }
    );

    this
      .service
      .updateList(this.list.id, data, search)
      .subscribe(
      _ => {
        $('#listsEdit').modal('hide');
        this.edited.emit(this.form.value);
        this.resetModal();
      },
      err => console.log(err)
      );
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
  }

  onHandleRemove(id) {
    this.list = Object.assign(
      {},
      this.list,
      {
        users: this.list.users.filter(user => user.id !== id)
      }
    );

    this.form.controls['user_ids'].setValue(this.list.users);
  }

  buildChips() {
    let chips = [];

    this.list.users.map(user => {
      chips.push(
        {
          'label': `${user.firstname} ${user.lastname}`,
          'id': user.id
        }
      );
    });

    return chips;
  }

  ngOnInit() {
    this.chipOptions = {
      icon: 'account_box',
      withClose: true,
      withAvatar: true
    };

    if (this.list.users.length) {
      this.list = Object.assign(
        {},
        this.list,
        {
          users: this.buildChips()
        }
      );
    }
    console.log(this.list);
    this.form = this.fb.group({
      'name': [this.list.name, Validators.required],
      'description': [this.list.description || null],
      'user_ids': [this.list.users, Validators.required],
    });
  }
}
