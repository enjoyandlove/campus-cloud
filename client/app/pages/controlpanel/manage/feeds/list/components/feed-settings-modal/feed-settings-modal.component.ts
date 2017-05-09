import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../../feeds.service';

@Component({
  selector: 'cp-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss']
})
export class FeedSettingsComponent implements OnInit {
  walls;
  privileges;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedsService: FeedsService
  ) {
    this.feedsService.getSocialGroups();

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', '157');

    this
      .feedsService
      .getSocialGroups(search)
      .map(groups => {
        let _groups = [];

        groups.forEach(group => {
          _groups.push({
            id: group.id,
            name: group.name,
            min_posting_member_type: group.min_posting_member_type,
            min_commenting_member_type: group.min_commenting_member_type
          });
        });
        return _groups;
      })
      .subscribe(
        walls => {
          walls.forEach(wall => this.addFeedControl(wall));
        });
  }

  createFeedControl(wall) {
    return this.fb.group({
      'name': [wall.name, Validators.required],
      'wall_id': [wall.id, Validators.required],
      'min_posting_member_type': [wall.min_posting_member_type, Validators.required],
      'min_commenting_member_type': [wall.min_commenting_member_type, Validators.required]
    });
  }

  addFeedControl(wall) {
    const control = <FormArray>this.form.controls['walls'];
    control.push(this.createFeedControl(wall));
  }

  onCanPostChanged(event, index) {
    const controls = <FormArray>this.form.controls['walls'];
    const control = <FormGroup>controls.at(index);

    control.controls['min_posting_member_type'].setValue(event.action);

    this.updateGroup(control);
  }

  onCanCommentChanged(event, index) {
    const controls = <FormArray>this.form.controls['walls'];
    const control = <FormGroup>controls.at(index);

    control.controls['min_commenting_member_type'].setValue(event.action);

    this.updateGroup(control);
  }

  updateGroup(control) {
    let search = new URLSearchParams();
    search.append('school_id', '157');

    this
      .feedsService
      .upodateSocialGroup(control.value.wall_id, control.value, search)
      .subscribe(
        _ => { return; });
  }

  getPrivilegeObj(privilege) {
    let result;

    this.privileges.forEach(_privilege => {
      if (_privilege.action === privilege) {
        result = _privilege;
      }
    });

    return result;
  }

  ngOnInit() {
    this.form = this.fb.group({
      'walls': this.fb.array([])
    });

    this.privileges = [
      {
        label: 'Disabled',
        action: 100
      },
      {
        label: 'Team Members',
        action: 3
      },
      {
        label: 'Everyone',
        action: 0
      }
    ];
  }
}
