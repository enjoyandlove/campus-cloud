import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss']
})
export class FeedSettingsComponent implements OnInit {
  @Input() walls: any[];
  form: FormGroup;
  privileges;

  constructor(
    private fb: FormBuilder
  ) { }

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

    this.walls = [
      {
        id: 1,
        name: 'Campus Wall',
        can_post: 2,
        can_comment: 1
      },
      {
        id: 2,
        name: 'Campus Wall 2',
        can_post: 1,
        can_comment: 1
      },
      {
        id: 3,
        name: 'Campus Wall 3',
        can_post: -1,
        can_comment: 2
      }
    ];

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

    this.walls.forEach(wall => this.addFeedControl(wall));
  }
}
