import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { ListsService } from '../lists.service';

declare var $: any;

@Component({
  selector: 'cp-lists-create',
  templateUrl: './lists-create.component.html',
  styleUrls: ['./lists-create.component.scss']
})
export class ListsCreateComponent implements OnInit, OnDestroy {
  @Input() users: Array<any> = [];
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() resetChips$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  chipOptions;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private service: ListsService,
  ) { }

  doSubmit() {
    this.created.emit(this.form.value);
    this.resetModal();
  }

  resetModal() {
    this.form.reset();
    this.reset.emit();
    this.resetChips$.next(true);
    $('#listsCreate').modal('hide');
  }

  onRemoveUser(id) {
    this.users = this.users.filter(user => user.id !== id);
  }

  ngOnDestroy() {
    this.resetModal();
  }

  ngOnInit() {
    this.users = [
      {
        'label': 'tom@oohlalamobile.com',
        'id': 1
      },
      {
        'label': 'john@oohlalamobile.com',
        'id': 2
      },
      {
        'label': 'louise@oohlalamobile.com',
        'id': 3
      }
    ];

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'description': [null],
      'users': [null, Validators.required],
    });

    this.chipOptions = {
      icon: 'account_box',
      withClose: true,
      withAvatar: true
    };
  }
}
