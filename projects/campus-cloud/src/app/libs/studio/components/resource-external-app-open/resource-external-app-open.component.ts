import { Input, OnInit, Output, Component, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { IItem } from '@projects/campus-cloud/src/app/shared/components';
import { IExternalAppOpenFormDetails } from './external-app-open.interface';
import { ILink } from '@controlpanel/customise/personas/tiles/link.interface';
import { ResourceExternalAppOpenUtils } from './resource-external-app-open.utils.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-personas-resource-external-app-open',
  templateUrl: './resource-external-app-open.component.html',
  styleUrls: ['./resource-external-app-open.component.scss']
})
export class PersonasResourceExternalAppOpenComponent implements OnInit, OnDestroy {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() showErrors = false;

  @Output()
  valueChanges: EventEmitter<IExternalAppOpenFormDetails | { link_url: null }> = new EventEmitter();

  selectedOption: IItem;
  form: FormGroup = this.getForm();

  options = this.utils.getShortcutOptions();

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(private fb: FormBuilder, private utils: ResourceExternalAppOpenUtils) {}

  onOptionSelected({ action }: IItem) {
    const linkParams: AbstractControl = this.form.get('link_params');

    if (!action || !ResourceExternalAppOpenUtils.thirdPartyShortcuts[action]) {
      linkParams.reset();
      return;
    }

    linkParams.patchValue(ResourceExternalAppOpenUtils.thirdPartyShortcuts[action]);
  }

  getForm(): FormGroup {
    return this.fb.group({
      link_type: [CampusLink.linkType.appOpen],
      link_url: [CampusLink.appOpen],
      link_params: this.fb.group({
        android: this.fb.group({
          fallback_http_url: ['', CustomValidators.requiredNonEmpty],
          package_name: ['', CustomValidators.requiredNonEmpty]
        }),
        ios: this.fb.group({
          fallback_http_url: ['', CustomValidators.requiredNonEmpty],
          app_link: ['', CustomValidators.requiredNonEmpty]
        })
      })
    });
  }

  getInitialFormValues() {
    if (
      this.isEdit &&
      this.campusLink &&
      this.campusLink.link_type === CampusLink.linkType.appOpen
    ) {
      const thirdPartyId =
        ResourceExternalAppOpenUtils.thirdPartyTypeIdFromLinkParams(this.campusLink.link_params) ||
        null;
      this.selectedOption = this.options.find((option: IItem) => option.action === thirdPartyId);

      const { link_type, link_url, link_params } = this.campusLink;
      return { link_type, link_url, link_params };
    }
    this.selectedOption = this.options.find((option: IItem) => option.action === null);
    return this.form.value;
  }

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const tooBig = JSON.stringify(this.form.value).length > 1024;

      this.valueChanges.emit({
        ...this.form.value,
        link_url: this.form.invalid || tooBig ? null : CampusLink.appOpen
      });
    });

    this.form.patchValue(this.getInitialFormValues());
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
