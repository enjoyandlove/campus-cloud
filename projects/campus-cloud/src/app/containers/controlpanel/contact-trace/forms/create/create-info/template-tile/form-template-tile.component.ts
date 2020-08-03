import { Component, Input, OnInit } from '@angular/core';
import { Form, FormType } from '../../../models';

@Component({
  selector: 'cp-form-template-tile',
  templateUrl: './form-template-tile.component.html',
  styleUrls: ['./form-template-tile.component.scss']
})
export class FormTemplateTileComponent implements OnInit {
  @Input() form: Form;
  @Input() selected: boolean;
  formType = FormType;

  constructor() {}

  ngOnInit(): void {}
}
