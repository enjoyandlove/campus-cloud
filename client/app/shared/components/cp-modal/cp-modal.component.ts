import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-modal',
  templateUrl: './cp-modal.component.html',
  styleUrls: ['./cp-modal.component.scss']
})
export class CPModalComponent implements OnInit {
  @Input() modalId: string;

  constructor() { }

  ngOnInit() {
    // console.log(this, 'init modal');
  }
}
