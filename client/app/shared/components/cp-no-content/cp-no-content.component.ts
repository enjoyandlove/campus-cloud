import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-no-content',
  templateUrl: './cp-no-content.component.html',
  styleUrls: ['./cp-no-content.component.scss']
})
export class CPNoContentComponent implements OnInit {
  @Input() noContentText: string;

  constructor() { }

  ngOnInit() { }
}
