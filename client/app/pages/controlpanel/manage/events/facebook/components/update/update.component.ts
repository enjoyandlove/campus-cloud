import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { EventsService } from '../../../events.service';
import { BaseComponent } from '../../../../../../../base/base.component';

@Component({
  selector: 'cp-facebook-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class FacebookEventsUpdateComponent extends BaseComponent implements OnInit {
  @Input() stores: Array<any>;

  links;
  isEdited;
  loading = true;
  form: FormGroup;
  deleteLink = '';

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService
  ) {
    super();
    this.fetch();
  }

  buildForm() {
    this.form = this.fb.group({
      'links': this.fb.array(this.buildEventControls())
    });

    this.loading = false;

    this.form.valueChanges.subscribe(_ => this.isEdited = true);
  }

  buildEventControls() {
    let arr = [];

    this.links.map(link => {
      arr.push(this.buildEventControl(link));
    });

    return arr;
  }

  onBulkUpdate(data) {
    let search = new URLSearchParams();
    search.append('school_id', '157');

    let _links = [];


    data.links.forEach(link => {
      _links.push({
        id: link.id,
        url: link.url,
        store_id: link.store_id
      });
    });

    this
      .eventsService
      .bulkUpdateFacebookEvents(_links, search)
      .subscribe(
      _ => this.fetch(),
      err => console.log(err)
      );
  }

  onSelectedStore(store, index) {
    const controls = <FormArray>this.form.controls['links'];
    const control = <FormGroup>controls.controls[index];

    control.controls['store_id'].setValue(store.action);
  }

  buildEventControl(link) {
    return this.fb.group({
      'id': [link.id],
      'url': [link.url, Validators.required],
      'store_id': [link.store_id, Validators.required],
      'selected': [link.host]
    });
  }

  onDeleted() {
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    let search = new URLSearchParams();
    search.append('school_id', '157');

    const links$ = this.eventsService.getFacebookEvents(search).map((links: any) => {
      let _links = [];

      links.map(link => {
        _links.push({
          id: link.id,
          url: link.url,
          store_id: link.store_id,
          host: {
            label: link.store_name,
            action: link.store_id
          }
        });
      });
      return _links;
    });

    super
      .fetchData(links$)
      .then(res => {
        this.links = res.data;
        this.buildForm();
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    // console.log(this);
  }
}
