import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-personas-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class PersonasSectionTitleComponent implements OnInit {
  @Input() name: string;

  constructor() {}

  ngOnInit(): void {}
}
