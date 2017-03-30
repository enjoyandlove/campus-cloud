import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-clubs-delete',
  templateUrl: './clubs-delete.component.html',
  styleUrls: ['./clubs-delete.component.scss']
})
export class ClubsDeleteComponent implements OnInit {
  @Input() club: any;
  @Output() deletedClub: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onDelete() {
    this.deletedClub.emit(this.club.id);
    $('#deleteClubsModal').modal('hide');
  }

  ngOnInit() { }
}
