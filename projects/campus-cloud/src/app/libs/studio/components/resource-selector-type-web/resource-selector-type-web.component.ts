import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { validUrl } from '@campus-cloud/shared/utils/forms';
import { ZendeskService } from '@campus-cloud/shared/services';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { ContentUtilsProviders } from '../../providers';
import { ILink } from '@controlpanel/manage/links/link.interface';
import { IStudioContentResource } from './../../providers/content.utils.providers';

@Component({
  selector: 'cp-resource-selector-type-web',
  templateUrl: './resource-selector-type-web.component.html',
  styleUrls: ['./resource-selector-type-web.component.scss'],
  providers: [ContentUtilsProviders]
})
export class ResourceSelectorTypeWebComponent implements OnInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;

  @Output() valueChanges: EventEmitter<any> = new EventEmitter();

  resources = [];
  form: FormGroup;
  showForm = false;
  selectedItem = null;
  inappLinkMessage = ZendeskService.getUrl('articles/360011676854');
  items: IStudioContentResource[] = [{ label: '---', id: null, meta: null }];

  constructor(private contentUtils: ContentUtilsProviders, private fb: FormBuilder) {}

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
      .find(
        (i: IStudioContentResource) =>
          Boolean(i.meta.open_in_browser) === this.campusLink.open_in_browser
      );

    const { link_url, open_in_browser } = this.campusLink;

    this.form.patchValue({
      link_url,
      open_in_browser
    });

    this.showForm = true;
  }

  ngOnInit() {
    this.resources = ContentUtilsProviders.getResourcesForType(
      ContentUtilsProviders.contentTypes.web
    );

    this.items = this.contentUtils.resourcesToIItem(this.resources);

    this.buildForm();
    this.form.valueChanges.subscribe(() => {
      const value = this.form.valid
        ? this.form.value
        : {
            link_url: '',
            link_params: {}
          };

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
      open_in_browser: openInBrowser
    });
  }
}
