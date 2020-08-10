import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactTraceHeaderService } from '@controlpanel/contact-trace/utils';
import { BaseComponent } from '@projects/campus-cloud/src/app/base';
import { CPI18nService, CPTrackingService } from '@projects/campus-cloud/src/app/shared/services';
import { HealthPassService } from './health-pass.service';
import { Store } from '@ngrx/store';
import { ISnackbar, baseActionClass } from '@projects/campus-cloud/src/app/store';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import IHealthPass, { EState } from './health-pass.interface';

@Component({
  selector: 'cp-health-pass',
  templateUrl: './health-pass.component.html',
  styleUrls: ['./health-pass.component.scss']
})
export class HealthPassComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  formErrors;
  lastHealthPassData: Array<IHealthPass> = [];
  healthPassData: Array<IHealthPass> = [];

  isDisabled: boolean = false;
  loading: boolean;

  constructor(
    private session: CPSession,
    private headerService: ContactTraceHeaderService,
    public cpI18n: CPI18nService,
    private store: Store<ISnackbar>,
    public service: HealthPassService,
    private cpTracking: CPTrackingService,
    private fb: FormBuilder
  ) {
    super();
  }

  private fetch() {
    this.loading = true;
    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    this.service
      .getHealthPass(params)
      .toPromise()
      .then((res) => {
        this.healthPassData = this.assignIcons(res);
        this.lastHealthPassData = this.healthPassData.map((item) => ({ ...item }));

        this.form = this.fb.group({
          'name-0': [this.healthPassData[0].name, Validators.required],
          'description-0': [this.healthPassData[0].description, Validators.required],
          'name-1': [this.healthPassData[1].name, Validators.required],
          'description-1': [this.healthPassData[1].description, Validators.required],
          'name-2': [this.healthPassData[2].name, Validators.required],
          'description-2': [this.healthPassData[2].description, Validators.required],
          'name-3': [this.healthPassData[3].name, Validators.required],
          'description-3': [this.healthPassData[3].description, Validators.required]
        });
      })
      .catch(() => {
        this.handleError(this.cpI18n.translate('something_went_wrong'));
      })
      .finally(() => {
        this.loading = false;
      });
  }

  handleError(body) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body
      })
    );
  }

  onSubmit() {
    this.formErrors = false;
    this.isDisabled = true;

    this.healthPassData.forEach((e, i) => {
      this.form.controls[`name-${i}`].setValue(e.name);
      this.form.controls[`description-${i}`].setValue(e.description);
    });

    if (!this.form.valid) {
      this.formErrors = true;
      this.isDisabled = false;

      this.handleError(this.cpI18n.translate('error_fill_out_marked_fields'));

      return;
    }

    const params = new HttpParams().set('school_id', this.session.school.id.toString());

    this.service
      .updateHealthPass(
        this.healthPassData.map(({ name, description, state }) => {
          return { name, description, state };
        }),
        params
      )
      .toPromise()
      .then((res) => {
        this.healthPassData = this.assignIcons(res);
        this.lastHealthPassData = this.healthPassData.map((item) => ({ ...item }));

        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18n.translate('t_changes_saved_ok')
          })
        );
      })
      .catch(() => {
        this.handleError(this.cpI18n.translate('something_went_wrong'));
      })
      .finally(() => {
        this.isDisabled = false;
      });
  }

  onCancel() {
    this.formErrors = false;
    this.healthPassData = this.lastHealthPassData.map((item) => ({ ...item }));
  }

  assignIcons(res) {
    const pathToAsset = `${environment.root}assets/svg/contact-trace/health-pass`;
    let result = res.map((item) => {
      let obj = Object.assign({}, item);
      switch (item.state) {
        case EState.green:
          obj.icon = `${pathToAsset}/health-pass-green.svg`;
          obj.title = this.cpI18n.translate('health_pass_green');
          break;
        case EState.yellow:
          obj.icon = `${pathToAsset}/health-pass-yellow.svg`;
          obj.title = this.cpI18n.translate('health_pass_yellow');
          break;
        case EState.red:
          obj.icon = `${pathToAsset}/health-pass-red.svg`;
          obj.title = this.cpI18n.translate('health_pass_red');
          break;
        case EState.no:
          obj.icon = `${pathToAsset}/health-pass-no.svg`;
          obj.title = this.cpI18n.translate('health_pass_no');
          break;
        default:
          break;
      }
      return obj;
    });
    return result;
  }

  ngOnInit(): void {
    this.headerService.updateHeader();
    this.fetch();
  }
}
