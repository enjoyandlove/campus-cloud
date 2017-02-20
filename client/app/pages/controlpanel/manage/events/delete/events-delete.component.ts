import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  @Input() event: any;

  constructor() { }

  onDelete() {
    console.log(`Deleteing ${this.event}`);
  }

  ngOnInit() { }
}
