import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContactTraceHeaderService } from '@controlpanel/contact-trace/utils';
import { BaseComponent } from '@projects/campus-cloud/src/app/base';
import { Store } from '@ngrx/store';
import { baseActionClass, ISnackbar } from '@projects/campus-cloud/src/app/store';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import IHealthPass, { EState } from './health-pass.interface';
import { HealthPassEditComponent } from '@controlpanel/contact-trace/health-pass/edit/health-pass-edit.component';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { OverlayRef } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import {
  selectAllHealthPass,
  selectDisplayErrorMessage,
  selectDisplaySuccessMessage,
  State
} from '@controlpanel/contact-trace/health-pass/store/selectors/health-pass.selector';
import { HealthPassPageActions } from '@controlpanel/contact-trace/health-pass/store/actions';
import { map } from 'rxjs/operators';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';


@Component({
  selector: 'cp-health-pass',
  templateUrl: './health-pass.component.html',
  styleUrls: ['./health-pass.component.scss']
})
export class HealthPassComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  formErrors;
  healthPassData$: Observable<IHealthPass[]>;
  shouldDisplaySuccessMessage$: Observable<boolean>;
  shouldDisplayErrorMessage$: Observable<boolean>;
  currentHealthPassData: IHealthPass[];

  isDisabled = false;

  editModal: OverlayRef;

  constructor(
    private session: CPSession,
    private headerService: ContactTraceHeaderService,
    public cpI18n: CPI18nPipe,
    private store: Store<ISnackbar>,
    private healthPassStore: Store<State>,
    private modalService: ModalService
  ) {
    super();

    this.healthPassData$  = this.healthPassStore.select(selectAllHealthPass).pipe(map((list) => this.assignIcons(list)));

    this.healthPassData$.subscribe(list => {
      this.currentHealthPassData = list;
    });

    this.shouldDisplaySuccessMessage$ = this.healthPassStore.select(selectDisplaySuccessMessage);
    this.shouldDisplaySuccessMessage$.subscribe(hasSuccessMessage => {
      if (hasSuccessMessage) {
        this.resetModal();
        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18n.transform('t_changes_saved_ok')
          })
        );

        this.healthPassStore.dispatch(HealthPassPageActions.initSuccessMessage());
      }
    });

    this.shouldDisplayErrorMessage$ = this.healthPassStore.select(selectDisplayErrorMessage);
    this.shouldDisplayErrorMessage$.subscribe(hasErrorMessage => {
      if (hasErrorMessage) {
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: this.cpI18n.transform('something_went_wrong')
          })
        );

        this.healthPassStore.dispatch(HealthPassPageActions.initErrorMessage());
      }
    });
  }

  assignIcons(res) {
    const pathToAsset = `${environment.root}assets/svg/contact-trace/health-pass`;
    const result = res.map((item) => {
      const obj = Object.assign({}, item);
      switch (item.state) {
        case EState.green:
          obj.icon = `${pathToAsset}/health-pass-green.svg`;
          obj.title = this.cpI18n.transform('health_pass_green');
          break;
        case EState.yellow:
          obj.icon = `${pathToAsset}/health-pass-yellow.svg`;
          obj.title = this.cpI18n.transform('health_pass_yellow');
          break;
        case EState.red:
          obj.icon = `${pathToAsset}/health-pass-red.svg`;
          obj.title = this.cpI18n.transform('health_pass_red');
          break;
        case EState.no:
          obj.icon = `${pathToAsset}/health-pass-no.svg`;
          obj.title = this.cpI18n.transform('health_pass_no');
          break;
        default:
          break;
      }
      return obj;
    });
    return result;
  }

  ngOnInit(): void {
    this.healthPassStore.dispatch(HealthPassPageActions.enter({school_id: this.session.school.id.toString()}));

    this.headerService.updateHeader();
  }

  openEditModal(healthPass: IHealthPass) {

    this.editModal = this.modalService.open(HealthPassEditComponent, {
      data: healthPass,
      onAction: this.onEdited.bind(this),
      onClose: this.resetModal.bind(this)
    });

  }

  onEdited(healthPass: IHealthPass): void {
    this.healthPassStore.dispatch(HealthPassPageActions.edit({
      healthPassList: this.currentHealthPassData.map(({ name, description, state }) => {
        return state === healthPass.state ?
          {name: healthPass.name, description: healthPass.description, state} :
          { name, description, state };
      }), school_id: this.session.school.id.toString()}));
  }

  resetModal() {
    this.editModal.dispose();
  }

}
