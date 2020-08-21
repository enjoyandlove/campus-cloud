import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-dot',
  templateUrl: './cp-dot.component.html',
  styleUrls: ['./cp-dot.component.scss']
})
export class CPDotComponent implements OnInit {
  @Input() color: string;

  constructor() {}

  ngOnInit() {}
}
