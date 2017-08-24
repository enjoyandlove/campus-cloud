import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class StudentsProfileHeaderComponent implements OnInit {
  @Output() message: EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
