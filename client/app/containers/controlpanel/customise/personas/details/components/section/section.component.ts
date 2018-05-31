import { Component, OnInit, Input } from '@angular/core';

import { ICampusGuide } from './../../../persona.interface';
import { PersonasUtilsService } from './../../../personas.utils.service';

@Component({
  selector: 'cp-personas-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class PersonasSectionComponent implements OnInit {
  @Input() guide: ICampusGuide;

  constructor(public utils: PersonasUtilsService) {}

  onEditClick() {
    console.log('EDIT CLICK');
  }

  onToggleTile() {
    console.log('TOGGLE CLICK');
  }

  onDeleteClick() {
    console.log('DELETE CLICK');
  }

  ngOnInit(): void {}
}
