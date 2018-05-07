import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/index';
import { MemberType } from '../member.status';
import { MembersService } from '../members.service';
import { MembersUtilsService } from '../members.utils.service';

declare var $: any;

@Component({
  selector: 'cp-members-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ClubsMembersCreateComponent implements OnInit, AfterViewInit {
  @Input() groupId: number;
  @Input() isOrientation: boolean;

  @ViewChild('input') input: ElementRef;
  @Output() added: EventEmitter<any> = new EventEmitter();

  buttonData;
  formErrors;
  memberTypes;
  members = [];
  form: FormGroup;
  isExecutiveLeader = MemberType.executive_leader;
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: MembersService,
    private utils: MembersUtilsService
  ) {}

  ngAfterViewInit() {
    const keyup$ = Observable.fromEvent(this.input.nativeElement, 'keyup');
    const blur$ = Observable.fromEvent(this.input.nativeElement, 'blur');

    blur$.debounceTime(200).subscribe((_) => {
      if (this.members.length) {
        this.members = [];
      }
    });

    keyup$
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((event: KeyboardEvent) => {
        const target = <HTMLInputElement>event.target;
        const query = target.value;

        if (!query) {
          return Observable.of([]);
        }

        const search = new URLSearchParams();
        search.append('search_str', query);
        search.append('school_id', this.session.g.get('school').id.toString());

        return this.service.getMembers(search, 1, 1000).map((members) => {
          if (!members.length) {
            return [{ label: this.cpI18n.translate('no_results') }];
          }

          return members.map((member) => {
            return {
              label: `${member.firstname} ${member.lastname}`,
              id: member.id
            };
          });
        });
      })
      .subscribe((members) => (this.members = members));
  }

  onMemberSelected(member) {
    if (!member.id) {
      return;
    }

    this.members = [];
    this.input.nativeElement.value = member.label;
    this.form.controls['member'].setValue(member.id);
  }

  onTypeChange(type): void {
    const control = this.form.controls['member_type'];
    control.setValue(type);
  }

  doReset() {
    this.form.controls['member'].setValue(null);
    this.form.controls['member_type'].setValue(this.memberTypes[0].action);
    this.input.nativeElement.value = null;
  }

  onSave() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;

      return;
    }

    if (this.form.value.member_type !== MemberType.executive_leader) {
      this.form.controls['member_position'].setValue(null);
    }

    const group_id = this.groupId;
    const member_position = this.form.value.member_position;
    const member_type = this.form.value.member_type;

    this.service
      .addMember({ member_type, group_id, member_position }, this.form.value.member)
      .subscribe(
        (member) => {
          this.added.emit(member);
          $('#membersCreate').modal('hide');
          this.doReset();
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: true
          });
          this.reset$.next(true);
        },
        (err) => {
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: true
          });
          throw new Error(err);
        }
      );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('save'),
      disabled: true,
      class: 'primary'
    };

    this.memberTypes = [
      {
        label: this.cpI18n.translate('member'),
        action: MemberType.member
      },
      {
        label: this.utils.getMemberType(this.isOrientation),
        action: MemberType.executive_leader
      }
    ];

    this.form = this.fb.group({
      member: [null, Validators.required],
      member_type: [this.memberTypes[0].action, Validators.required],
      member_position: [null]
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }
}
