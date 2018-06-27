import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-personas-link-form',
  templateUrl: './tile-link-form.component.html',
  styleUrls: ['./tile-link-form.component.scss']
})
export class PersonasTileLinkFormComponent implements OnInit {
  @Input() form: FormGroup;

  contentTypes;

  state = {
    textInput: false,
    searchSource: null,
    resourceList: []
  };

  constructor(public cpI18n: CPI18nService) {}

  onContentTypeChange(selected) {
    if (selected.extra_field_type === 1) {
      this.state = {
        ...this.state,
        textInput: true
      };

      for (const key in selected.meta) {
        this.form.controls[key].setValue(selected.meta[key]);
      }
    }
  }

  onUrlChange(url) {
    this.form.controls['link_url'].setValue(url);
  }

  ngOnInit(): void {
    this.contentTypes = require('./content-types.json').map((content) => {
      return {
        ...content,
        label: this.cpI18n.translate(content.label)
      };
    });
  }
}
