import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { ListsService } from '../lists.service';

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
    // private service: ListsService,
  ) { }

  doSubmit() {
    $('#listsEdit').modal('hide');
    this.edited.emit(this.form.value);
    this.resetModal();
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

    this.form = this.fb.group({
      'id': [this.list.id, Validators.required],
      'store_id': [this.list.store_id, Validators.required],
      'name': [this.list.name, Validators.required],
      'description': [this.list.description],
      'users': [this.list.users, Validators.required],
    });
  }
}
