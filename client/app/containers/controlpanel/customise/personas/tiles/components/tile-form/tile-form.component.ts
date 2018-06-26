import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-personas-tile-form',
  templateUrl: './tile-form.component.html',
  styleUrls: ['./tile-form.component.scss']
})
export class PersonasTileFormComponent implements OnInit {
  @Input() form: FormGroup;

  extraFields = false;
  resources = require('./resources.json');
  contentTypes = require('./content-types.json');

  constructor() {}

  ngOnInit(): void {}
}
