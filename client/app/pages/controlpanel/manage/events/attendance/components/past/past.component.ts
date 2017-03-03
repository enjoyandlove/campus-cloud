import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-attendance-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.scss']
})
export class AttendancePastComponent implements OnInit {
  @Input() event: any;

  constructor() { }

  ngOnInit() {
    console.log(this.event);
  }
}
