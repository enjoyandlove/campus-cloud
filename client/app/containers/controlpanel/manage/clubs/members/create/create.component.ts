import { HttpParams } from '@angular/common/http';
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
import { BehaviorSubject, fromEvent, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { MemberType } from '../member.status';
import { MembersService } from '../members.service';
import { CPSession } from '../../../../../../session';
import { MembersUtilsService } from '../members.utils.service';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../shared/services';

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

  eventProperties = {
    member_id: null,
    member_type: null
  };

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: MembersService,
    private utils: MembersUtilsService,
    private cpTracking: CPTrackingService
  ) {}

  ngAfterViewInit() {
    const keyup$ = fromEvent(this.input.nativeElement, 'keyup');
    const blur$ = fromEvent(this.input.nativeElement, 'blur');

    blur$.pipe(debounceTime(200)).subscribe((_) => {
      if (this.members.length) {
        this.members = [];
      }
    });

    keyup$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((event: KeyboardEvent) => {
          const target = <HTMLInputElement>event.target;
          const query = target.value;

          if (!query) {
            return observableOf([]);
          }

          const search = new HttpParams()
            .append('search_str', query)
            .append('school_id', this.session.g.get('school').id.toString());

          return this.service.getMembers(search, 1, 1000).pipe(
            map((members: Array<any>) => {
              if (!members.length) {
                return [{ label: this.cpI18n.translate('no_results') }];
              }

              return members.map((member) => {
                return {
                  label: `${member.firstname} ${member.lastname}`,
                  id: member.id
                };
              });
            })
          );
        })
      )
      .subscribe((members: any) => (this.members = members));
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
          this.trackEvent(member);
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

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      member_id: res.id,
      member_type: this.utils.getMemberTypeLabel(res.member_type)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_ADDED_CLUB_MEMBER,
      this.eventProperties
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
