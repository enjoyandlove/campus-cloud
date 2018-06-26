import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-personas-tile-form',
  templateUrl: './tile-form.component.html',
  styleUrls: ['./tile-form.component.scss']
})
export class PersonasTileFormComponent implements OnInit {
  @Input() form: FormGroup;

  resources;
  contentTypes;
  extraFields = false;

  constructor(public cpI18n: CPI18nService) {}

  onContentTypeChange(selected) {
    console.log(selected);
  }

  ngOnInit(): void {
    this.resources = require('./resources.json').map((resource) => {
      return {
        ...resource,
        label: this.cpI18n.translate(resource.label)
      };
    });
    this.contentTypes = require('./content-types.json').map((content) => {
      return {
        ...content,
        label: this.cpI18n.translate(content.label)
      };
    });
  }
}
