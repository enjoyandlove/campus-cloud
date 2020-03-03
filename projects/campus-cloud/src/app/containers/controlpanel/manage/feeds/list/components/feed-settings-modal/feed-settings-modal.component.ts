import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

const TYPE_STRINGS = {
  [GroupType.orientation]: {
    wallName: 'orientation_wall_name',
    modalTitle: 'orientation_feeds_wall_settings_modal_title',
    membersLabel: 't_orientation_everyone'
  },
  [GroupType.service]: {
    wallName: 'services_label_name',
    modalTitle: 't_services_wall_settings_modal_title',
    membersLabel: 't_service_everyone'
  },
  default: {
    wallName: 'feeds_wall_name',
    modalTitle: 'feeds_wall_settings_modal_title',
    membersLabel: 'feeds_everyone'
  }
};

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss']
})
export class FeedSettingsComponent implements OnInit, OnDestroy {
  @Input() groupId: number;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<any>;

  @Output() updateWallSettings: EventEmitter<null> = new EventEmitter();

  walls;
  wallName;
  modalTitle;
  privileges;
  form: FormGroup;
  _isCampusWallView;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    public feedsService: FeedsService,
    private cpTracking: CPTrackingService,
    private feedsAmplitudeService: FeedsAmplitudeService
  ) {
    this.feedsService.getSocialGroups();
  }

  private fetch() {
    let search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    if (this.groupType === GroupType.orientation) {
      search = search.append('calendar_id', this.groupId.toString());
    }

    this.feedsService
      .getSocialGroups(search)
      .pipe(
        map((groups: Array<any>) => {
          let _groups = [];

          groups.forEach((group) => {
            _groups.push({
              id: group.id,
              name: group.name,
              related_obj_id: group.related_obj_id,
              min_posting_member_type: group.min_posting_member_type,
              min_commenting_member_type: group.min_commenting_member_type
            });
          });

          if (this.groupId) {
            _groups = _groups.filter((group) => group.related_obj_id === +this.groupId);
          }

          return _groups;
        })
      )
      .subscribe((walls) => {
        walls.forEach((wall) => this.addFeedControl(wall));
      });
  }

  createFeedControl(wall) {
    return this.fb.group({
      name: [wall.name, Validators.required],
      wall_id: [wall.id, Validators.required],
      min_posting_member_type: [wall.min_posting_member_type, Validators.required],
      min_commenting_member_type: [wall.min_commenting_member_type, Validators.required]
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
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.feedsService
      .upodateSocialGroup(control.value.wall_id, control.value, search)
      .subscribe((res: any) => {
        this.trackAmplitudeEvent();
        this.updateWallSettings.emit(res);
      });
  }

  getPrivilegeObj(privilege) {
    let result;

    this.privileges.forEach((_privilege) => {
      if (_privilege.action === privilege) {
        result = _privilege;
      }
    });

    return result;
  }

  trackAmplitudeEvent() {
    const { wall_source, sub_menu_name } = this.feedsAmplitudeService.getWallAmplitudeProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_UPDATED_SETTINGS, {
      wall_source,
      sub_menu_name
    });
  }

  ngOnInit() {
    this.wallName = this.cpI18n.translate(
      (TYPE_STRINGS[this.groupType] || TYPE_STRINGS.default).wallName
    );

    this.modalTitle = this.cpI18n.translate(
      (TYPE_STRINGS[this.groupType] || TYPE_STRINGS.default).modalTitle
    );

    this.fetch();
    this.form = this.fb.group({
      walls: this.fb.array([])
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
        label: this.cpI18n.translate(
          (TYPE_STRINGS[this.groupType] || TYPE_STRINGS.default).membersLabel
        ),
        action: 0
      }
    ];

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
