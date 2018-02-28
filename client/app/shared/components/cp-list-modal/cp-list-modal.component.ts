import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-list-modal',
  templateUrl: './cp-list-modal.component.html',
  styleUrls: ['./cp-list-modal.component.scss'],
})
export class CPListModalComponent implements OnInit {
  @Input() buttonText: string;
  @Input() headerText: string;
  @Input() list: Array<{item: string}>;

  constructor() {}

  ngOnInit() {}
}
