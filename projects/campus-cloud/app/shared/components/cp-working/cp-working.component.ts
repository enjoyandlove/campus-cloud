import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-working',
  templateUrl: './cp-working.component.html',
  styleUrls: ['./cp-working.component.scss']
})
export class CPWorkingComponent implements OnInit {
  @Input() width = 20;
  @Input() height = 20;

  constructor() {}

  ngOnInit(): void {}
}
