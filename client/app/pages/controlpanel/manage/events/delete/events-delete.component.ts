import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  @Input() name: string;

  constructor() { }

  close() {
    console.log('closing');
  }

  ngOnInit() { }
}
