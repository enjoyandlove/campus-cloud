import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-audience-counter',
  templateUrl: './audience-counter.component.html',
  styleUrls: ['./audience-counter.component.scss']
})
export class AudienceCounterComponent implements OnInit {
  @Input() message: string;

  constructor() {}

  ngOnInit(): void {}
}
