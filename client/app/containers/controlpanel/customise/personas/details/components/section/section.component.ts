import { Component, OnInit, Input } from '@angular/core';

import { ICampusGuide } from './../../../persona.interface';

@Component({
  selector: 'cp-personas-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class PersonasSectionComponent implements OnInit {
  @Input() guide: ICampusGuide;

  constructor() {}

  ngOnInit(): void {}
}
