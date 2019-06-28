import { Input, Output, Component, OnInit, EventEmitter } from '@angular/core';

import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';

@Component({
  selector: 'cp-resource-selector-type-external',
  templateUrl: './resource-selector-type-external.component.html',
  styleUrls: ['./resource-selector-type-external.component.scss']
})
export class ResourceSelectorTypeExternalComponent implements OnInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() showErrors = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
