import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../../feeds.service';
import { CPSession } from '../../../../../../../session';

@Component({
  selector: 'cp-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss']
})
export class FeedSettingsComponent implements OnInit {
  @Input() clubId: number;
  @Output() updateWallSettings: EventEmitter<null> = new EventEmitter();

  walls;
  privileges;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private feedsService: FeedsService
  ) {
    this.feedsService.getSocialGroups();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .feedsService
      .getSocialGroups(search)
      .map(groups => {
        let _groups = [];

        groups.forEach(group => {
          _groups.push({
            id: group.id,
            name: group.name,
            related_obj_id: group.related_obj_id,
            min_posting_member_type: group.min_posting_member_type,
            min_commenting_member_type: group.min_commenting_member_type
          });
        });

        if (this.clubId) {
          _groups = _groups.filter(group => group.related_obj_id === +this.clubId);
        }

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
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .feedsService
      .upodateSocialGroup(control.value.wall_id, control.value, search)
      .subscribe(
      res => this.updateWallSettings.emit(res) );
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
    this.fetch();
    this.form = this.fb.group({
      'walls': this.fb.array([])
    });

    this.privileges = [
      {
        label: this.cpI18n.translate('no_one'),
        action: 100
      },
      {
        label: this.cpI18n.translate('feeds_team_members'),
        action: 3
      },
      {
        label: this.cpI18n.translate('feeds_everyone'),
        action: 0
      }
    ];
  }
}
