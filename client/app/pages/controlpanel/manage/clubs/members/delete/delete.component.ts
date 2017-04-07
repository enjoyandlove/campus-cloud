import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-members-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class ClubsMembersDeleteComponent implements OnInit {
  @Input() member: any;

  constructor() { }

  onDelete() {
    console.log('delete');
  }

  ngOnInit() { }
}
