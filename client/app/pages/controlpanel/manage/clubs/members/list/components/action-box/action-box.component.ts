import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-clubs-members-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss']
})
export class ClubsMembersActionBoxComponent implements OnInit {
  @Output() query: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
