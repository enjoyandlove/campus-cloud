import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  ElementRef,
  EventEmitter,
  AfterViewInit
} from '@angular/core';

import { MembersService } from '../members.service';
import { CPSession } from '../../../../../../session';

const MEMBER_TYPE = 0;
const EXECUTIVE_TYPE = 2;

declare var $: any;

@Component({
  selector: 'cp-members-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ClubsMembersCreateComponent implements OnInit, AfterViewInit {
  @Input() groupId: number;
  @ViewChild('input') input: ElementRef;
  @Output() added: EventEmitter<any> = new EventEmitter();

  formErrors;
  memberTypes;
  members = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private service: MembersService,
  ) { }

  ngAfterViewInit() {
    const keyup$ = Observable.fromEvent(this.input.nativeElement, 'keyup');
    const blur$ = Observable.fromEvent(this.input.nativeElement, 'blur');

    blur$
    .debounceTime(200)
    .subscribe(_ => { if (this.members.length) { this.members = []; } });

    keyup$
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((event: KeyboardEvent) => {
        const target = <HTMLInputElement>event.target;
        const query = target.value;

        if (!query) { return Observable.of([]); }

        let search = new URLSearchParams();
        search.append('search_str', query);
        search.append('school_id', this.session.school.id.toString());

        return this.service.getMembers(search).map(members => {
          let _members = [];

          members.forEach(member => {
            _members.push({
              'label': `${member.firstname} ${member.lastname}`,
              'id': member.id
            });
          });

          if (!_members.length) {
            _members.push({ 'label': 'No Results...' });
          }

          return _members;
        });
      })
      .subscribe(res => this.members = res);
  }

  onMemberSelected(member) {
    this.members = [];
    this.input.nativeElement.value = member.label;
    this.form.controls['member'].setValue(member.id);
  }

  onTypeChange(type): void {
    let control = this.form.controls['member_type'];
    control.setValue(type);
  }

  onSave() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      return;
    }

    let member_type = this.form.value.member_type;
    let group_id = this.groupId;

    this
      .service
      .addMember({ member_type, group_id }, this.form.value.member)
      .subscribe(
        member => {
          this.added.emit(member);
          $('#membersCreate').modal('hide');
          this.form.reset();
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
    this.memberTypes = [
      {
        label: 'Member',
        action: MEMBER_TYPE
      },
      {
        label: 'Executive',
        action: EXECUTIVE_TYPE
      }
    ];

    this.form = this.fb.group({
      'member': [null, Validators.required],
      'member_type': [this.memberTypes[0].action, Validators.required],
    });
  }
}
