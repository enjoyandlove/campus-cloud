import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MembersService } from '../members.service';

declare var $: any;

@Component({
  selector: 'cp-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class ClubsMembersDeleteComponent implements OnInit {
  @Input() member: any;
  @Input() groupId: number;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(
    private service: MembersService,
  ) { }

  onDelete() {
    this
      .service
      .removeMember({
        member_type: -1,
        group_id: this.groupId
      }, this.member.id)
      .subscribe(
        _ => {
          this.deleted.emit(this.member.id);
          $('#membersDelete').modal('hide');
        },
        err => { throw new Error(err) }
      );
  }

  ngOnInit() { }
}
