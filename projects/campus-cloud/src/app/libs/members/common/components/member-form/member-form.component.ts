import { Input, ViewChild, Component, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { of, fromEvent, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

import { CPSession } from '@campus-cloud/session';
import { MemberType } from '../../model';
import { CPI18nService } from '@campus-cloud/shared/services';
import { IItem } from '@campus-cloud/shared/components';
import { LibsCommonMembersService } from '../../providers';

@Component({
  selector: 'cp-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss'],
  providers: [LibsCommonMembersService]
})
export class LibsMembersFormComponent implements AfterViewInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() selectedType: IItem;
  @Input() memberTypes: IItem[];
  @Input() showPosition = false;

  @ViewChild('input', { static: true }) input: ElementRef;

  members: IItem[] = [];
  destroy$ = new Subject();
  isExecutiveLeader = MemberType.executive_leader;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: LibsCommonMembersService
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
        takeUntil(this.destroy$),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((event: KeyboardEvent) => {
          const target = <HTMLInputElement>event.target;
          const query = target.value;

          if (!query) {
            return of([]);
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
                  action: member.id
                };
              });
            })
          );
        })
      )
      .subscribe((members: IItem[]) => (this.members = members));
  }

  onMemberSelected(member: IItem) {
    this.members = [];
    this.input.nativeElement.value = member.label;
    this.form.controls['member'].setValue(member.action);
  }

  onTypeChange(type: IItem): void {
    const control = this.form.controls['member_type'];
    control.setValue(type.action);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
