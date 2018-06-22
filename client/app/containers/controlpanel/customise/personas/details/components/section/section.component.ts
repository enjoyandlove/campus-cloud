import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ICampusGuide } from './../../../persona.interface';
import { PersonasUtilsService } from './../../../personas.utils.service';

@Component({
  selector: 'cp-personas-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class PersonasSectionComponent implements OnInit {
  @Input() guide: ICampusGuide;

  @Output() addTileClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteTile: EventEmitter<number> = new EventEmitter();
  @Output() editTileClick: EventEmitter<number> = new EventEmitter();
  @Output() toggleTileVisibility: EventEmitter<number> = new EventEmitter();

  constructor(public utils: PersonasUtilsService) {}

  ngOnInit(): void {}
}
