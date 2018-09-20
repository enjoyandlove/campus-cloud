import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { sortBy } from 'lodash';

import { ITile } from './../../../tile.interface';
import { IPersona } from './../../../../persona.interface';
import { TilesUtilsService } from './../../../tiles.utils.service';
import { ResourcesUtilsService } from '../../resources.utils.service';
import { PersonasLoginRequired } from './../../../../personas.status';
import { CPI18nService } from '../../../../../../../../shared/services/i18n.service';
import { PersonaType } from './../../../../../../assess/engagement/engagement.status';

@Component({
  selector: 'cp-personas-resource-types',
  templateUrl: './resource-types.component.html',
  styleUrls: ['./resource-types.component.scss']
})
export class PersonasResourceTypesComponent implements OnInit {
  @Input() resource;
  @Input() editView;
  @Input() tile: ITile;
  @Input() persona: IPersona;

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() linkUrl: EventEmitter<string> = new EventEmitter();

  resources;
  selectedItem = null;
  resourceSelection = null;

  textInputComponent = ['web_link', 'external_link'];

  typeSearchComponent = ['store', 'campus_service', 'subscribable_calendar'];

  constructor(
    public cpI18n: CPI18nService,
    public utils: ResourcesUtilsService,
    public tileUtils: TilesUtilsService
  ) {}

  onUrlChange(url) {
    this.linkUrl.emit(url);
  }

  onResourceSelected(selection) {
    this.resourceSelection = selection.id;

    this.selected.emit(selection);
  }

  populateDropdowns() {
    const resources = require('./resources.json');
    const sortedResources = sortBy(resources.slice(1, resources.length), (r: any) => r.id);
    const updatedResources = [resources[0], ...sortedResources];

    this.resources = updatedResources.map((resource) => {
      return {
        ...resource,
        label: this.cpI18n.translate(resource.label)
      };
    });

    if (this.persona.login_requirement === PersonasLoginRequired.forbidden) {
      this.resources = this.resources.filter((r) => (r.id ? !r.login_required : r));
    }

    if (this.persona.platform === PersonaType.web) {
      const webOrExternalLink = (r) => !('link_url' in r.meta);
      const isResourceSupportedByWebApp = (r) =>
        this.utils.isResourceSupportedByWebApp(r.meta.link_url);

      this.resources = this.resources.filter(
        (r) => (r.id ? webOrExternalLink(r) || isResourceSupportedByWebApp(r) : r)
      );
    }

    if (this.editView) {
      this.updateState();
    }
  }

  setUrlType() {
    const urlIds = ['web_link', 'external_link'];

    return this.resources
      .filter((r) => urlIds.includes(r.id))
      .filter((r) => !!r.meta.open_in_browser === this.resource.open_in_browser)
      .map((r) => r.id)[0];
  }

  setGeneralType() {
    return this.resources
      .filter((r) => r.meta.link_url === this.resource.link_url)
      .map((r) => r.id)[0];
  }

  updateResourceType() {
    this.selectedItem = this.resources.filter((r) => r.id === this.resourceSelection)[0];
  }

  updateState() {
    const isWebLink = this.tileUtils.isTileWebLink(this.tile.related_link_data.link_type);

    this.resourceSelection = isWebLink ? this.setUrlType() : this.setGeneralType();

    this.updateResourceType();
  }

  ngOnInit(): void {
    this.populateDropdowns();
  }
}
