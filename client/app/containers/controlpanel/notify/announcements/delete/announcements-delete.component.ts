import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-announcements-delete',
  templateUrl: './announcements-delete.component.html',
  styleUrls: ['./announcements-delete.component.scss']
})
export class AnnouncementDeleteComponent implements OnInit {
  @Input() item: any;

  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onArchive() {
    this.deleted.emit(this.item.id);
    $('#deleteAnnouncementModal').modal('hide');
  }

  ngOnInit() { }
}
