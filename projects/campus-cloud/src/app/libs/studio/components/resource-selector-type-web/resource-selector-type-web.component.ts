import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { protocolCheck } from '@campus-cloud/shared/utils';
import { ZendeskService } from '@campus-cloud/shared/services';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { ContentUtilsProviders, IStudioContentResource } from '../../providers';

@Component({
  selector: 'cp-resource-selector-type-web',
  templateUrl: './resource-selector-type-web.component.html',
  styleUrls: ['./resource-selector-type-web.component.scss'],
  providers: [ContentUtilsProviders]
})
export class ResourceSelectorTypeWebComponent implements OnInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() showErrors = false;
  @Input() filterByWebApp = false;
  @Input() filterByLoginStatus = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  resources = [];
  showForm = false;
  selectedItem = null;
  items: IStudioContentResource[];
  form: FormGroup = this.buildForm();

  constructor(private contentUtils: ContentUtilsProviders, private fb: FormBuilder) {}

  get hintText() {
    const linkType = this.form.get('link_type').value;

    const message =
      linkType === CampusLink.linkType.externalWebApp
        ? 't_personas_tile_link_external_webapp_message'
        : 't_personas_tile_link_donation_message';

    const link =
      linkType === CampusLink.linkType.externalWebApp
        ? ZendeskService.getUrl('articles/360025351694')
        : ZendeskService.getUrl('articles/360011676854');

    return {
      link,
      message
    };
  }

  buildForm() {
    return this.fb.group({
      link_url: ['', Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])],
      link_type: [null, Validators.required],
      link_params: [{}],
      open_in_browser: [null, Validators.required]
    });
  }

  updateStateWith({ link_url, link_type, link_params, open_in_browser }) {
    this.selectedItem = this.items
      .filter((i: IStudioContentResource) => i.meta)
      .find((i: IStudioContentResource) => {
        return (
          link_type === i.link_type && Boolean(i.meta.open_in_browser) === Boolean(open_in_browser)
        );
      });

    this.form.patchValue({ link_url, link_type, link_params, open_in_browser });
    this.showForm = true;
  }

  isCampusLinkInList() {
    if (!this.campusLink || !this.items.length) {
      return false;
    }

    return ContentUtilsProviders.getResourceItemByLinkType(this.items, this.campusLink.link_type);
  }

  getInitialFormValues() {
    if (this.isEdit && this.isCampusLinkInList()) {
      const { link_url, link_params, open_in_browser, link_type } = this.campusLink;
      return {
        link_url,
        link_type,
        link_params,
        open_in_browser
      };
    } else {
      const {
        link_type,
        meta: { link_params, open_in_browser }
      } = this.items[0];
      return {
        link_type,
        link_params,
        link_url: '',
        open_in_browser
      };
    }
  }

  ngOnInit() {
    const filters = [
      this.filterByWebApp ? ContentUtilsProviders.isOpenInAppBrowser : null,
      this.filterByLoginStatus
        ? (resource: IStudioContentResource) => resource.id !== 'external_web_app'
        : null
    ].filter((f) => f);

    this.resources = ContentUtilsProviders.getResourcesForType(
      ContentUtilsProviders.contentTypes.web,
      filters
    );

    this.items = this.contentUtils.resourcesToIItem(this.resources);

    this.form.valueChanges.subscribe(() => {
      const value =
        this.form.valid && this.selectedItem
          ? { ...this.form.value, link_url: protocolCheck(this.form.get('link_url').value) }
          : { ...this.form.value, link_url: '' };
      this.valueChanges.emit(value);
    });

    this.updateStateWith(this.getInitialFormValues());
  }

  onItemSelected(selection) {
    this.form.markAsPristine();
    this.selectedItem = selection.id ? selection : null;
    this.showForm = Boolean(selection.id);
    const openInBrowser = selection.id ? selection.meta.open_in_browser : null;

    this.form.patchValue({
      link_type: selection.link_type,
      open_in_browser: openInBrowser
    });
  }
}
