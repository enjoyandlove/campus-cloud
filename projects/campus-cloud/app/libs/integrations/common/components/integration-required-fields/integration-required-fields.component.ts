import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-integration-required-fields',
  templateUrl: './integration-required-fields.component.html',
  styleUrls: ['./integration-required-fields.component.scss']
})
export class IntegrationRequiredFieldsComponent implements OnInit {
  @Input() linkUrl = '#';

  constructor() {}

  ngOnInit() {}
}
