import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ContentUtilsProviders } from '../../providers';
import { IStudioContentResource } from '../../providers';
import { validUrl } from '@campus-cloud/shared/utils/forms';
import { ZendeskService } from '@campus-cloud/shared/services';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { ILink } from '@controlpanel/manage/links/link.interface';

@Component({
  selector: 'cp-resource-selector-type-web',
  templateUrl: './resource-selector-type-web.component.html',
  styleUrls: ['./resource-selector-type-web.component.scss'],
  providers: [ContentUtilsProviders]
})
export class ResourceSelectorTypeWebComponent implements OnInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() filterByWebApp = false;
  @Input() filterByLoginStatus = false;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  resources = [];
  form: FormGroup;
  showForm = false;
  selectedItem = null;

  items: IStudioContentResource[] = [{ label: '---', id: null, meta: null }];

  constructor(private contentUtils: ContentUtilsProviders, private fb: FormBuilder) {}

  get hintText() {
    const linkType = this.form.get('link_type').value;

    const message =
      linkType === 5
        ? 't_personas_tile_link_external_webapp_message'
        : 't_personas_tile_link_donation_message';

    const link =
      linkType === 5
        ? ZendeskService.getUrl('articles/360025009414')
        : ZendeskService.getUrl('articles/360011676854');

    return {
      link,
      message
    };
  }

  buildForm() {
    this.form = this.fb.group({
      link_url: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(validUrl),
          CustomValidators.requiredNonEmpty
        ])
      ],
      link_type: [0],
      link_params: [{}],
      open_in_browser: [null, Validators.required]
    });
  }

  updateState() {
    this.selectedItem = this.items
      .filter((i: IStudioContentResource) => i.meta)
      .find((i: IStudioContentResource) => {
        const regularWebLinkType = this.campusLink.link_type === 0;
        return regularWebLinkType
          ? Boolean(i.meta.open_in_browser) === this.campusLink.open_in_browser
          : i.link_type === this.campusLink.link_type;
      });

    const { link_url, open_in_browser, link_type } = this.campusLink;

    this.form.patchValue({
      link_url,
      link_type,
      open_in_browser
    });

    this.showForm = true;
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

    this.buildForm();
    this.form.valueChanges.subscribe(() => {
      const value = this.form.valid ? this.form.value : { link_url: '' };
      this.valueChanges.emit(value);
    });

    if (this.isEdit) {
      this.updateState();
    }
  }

  onItemSelected(selection) {
    this.form.markAsPristine();
    this.showForm = Boolean(selection.id);
    const openInBrowser = selection.id ? selection.meta.open_in_browser : null;

    this.form.patchValue({
      link_url: '',
      link_type: selection.link_type,
      open_in_browser: openInBrowser
    });
  }
}
