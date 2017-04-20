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
            can_post: 2,
            can_comment: 1
          });
        });
        return _groups;
      })
      .subscribe(
        walls => walls.forEach(wall => this.addFeedControl(wall)),
        err => console.log(err)
      );
  }

  createFeedControl(wall) {
    return this.fb.group({
      'name': [wall.name, Validators.required],
      'wall_id': [wall.wall_id, Validators.required],
      'can_post': [wall.can_post, Validators.required],
      'can_comment': [wall.can_comment, Validators.required]
    });
  }

  addFeedControl(wall) {
    const control = <FormArray>this.form.controls['walls'];
    control.push(this.createFeedControl(wall));
  }

  onCanPostChanged(event, index) {
    const controls = <FormArray>this.form.controls['walls'];
    const control = <FormGroup>controls.at(index);

    control.controls['can_post'].setValue(event.action);
  }

  onCanCommentChanged(event, index) {
    const controls = <FormArray>this.form.controls['walls'];
    const control = <FormGroup>controls.at(index);

    control.controls['can_comment'].setValue(event.action);
  }

  onSave() {
    console.log(this.form.value);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'walls': this.fb.array([])
    });

    this.privileges = [
      {
        label: 'Disabled',
        action: -1
      },
      {
        label: 'Team Members',
        action: 1
      },
      {
        label: 'Everyone',
        action: 2
      }
    ];
  }
}
