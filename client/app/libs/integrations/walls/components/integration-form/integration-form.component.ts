import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { IItem } from '@shared/components';
import { CustomValidators } from '@shared/validators';

@Component({
  selector: 'cp-walls-integration-form',
  templateUrl: './integration-form.component.html',
  styleUrls: ['./integration-form.component.scss']
})
export class WallsIntegrationFormComponent implements OnInit {
  static readonly shouldCreateSocialPostCategory = -1;
  @Input() types: IItem[];
  @Input() form: FormGroup;
  @Input() selectedType: IItem;
  @Input() selectedChannel: IItem;
  @Input() channels$: Observable<IItem[]>;

  showChannelName = false;

  constructor() {}

  onTypeSelected({ action }: IItem) {
    this.form.get('feed_type').setValue(action);
  }

  onSelectedChannel({ action }: IItem) {
    this.showChannelName = action === 'new_channel';

    this.checkChannelNameControl(this.showChannelName);

    this.form
      .get('social_post_category_id')
      .setValue(
        this.showChannelName ? WallsIntegrationFormComponent.shouldCreateSocialPostCategory : action
      );
  }

  checkChannelNameControl(showChannelName: boolean) {
    const controlName = 'channel_name';
    if (showChannelName) {
      this.form.addControl(
        controlName,
        new FormControl(
          null,
          Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
        )
      );
    } else {
      this.form.removeControl(controlName);
    }
  }

  onImageUpload(image: string) {
    const imageStringOrEmpty = image ? image : '';

    this.form.get('poster_avatar_url').setValue(imageStringOrEmpty);
  }

  ngOnInit() {}
}
