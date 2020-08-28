import { Component, OnInit } from '@angular/core';
import {
  INotificationTemplate,
  NotificationTemplateType
} from '@controlpanel/contact-trace/health-pass/notification-templates/notification-template';
import { ModalService } from '@ready-education/ready-ui/overlays';
import { OverlayRef } from '@angular/cdk/overlay';
import { NotificationTemplateEditComponent } from '@controlpanel/contact-trace/health-pass/notification-templates/edit';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectAllNotificationTemplates,
  selectDisplayTemplateSuccessMessage,
  State
} from '@controlpanel/contact-trace/health-pass/store/selectors';
import { NotificationTemplatePageActions } from '@controlpanel/contact-trace/health-pass/store/actions';
import { baseActionClass, ISnackbar } from '@campus-cloud/store';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-notification-templates',
  templateUrl: './notification-templates.component.html',
  styleUrls: ['./notification-templates.component.scss']
})
export class NotificationTemplatesComponent implements OnInit {

  templates$: Observable<INotificationTemplate[]>;
  currentTemplates: INotificationTemplate[];
  shouldDisplaySuccessMessage$: Observable<boolean>;

  editModal: OverlayRef;
  envRootPath = environment.root;

  constructor(private modalService: ModalService,
              private healthPassStore: Store<State>,
              private store: Store<ISnackbar>,
              public cpI18n: CPI18nPipe) {

    this.templates$ = this.healthPassStore.select(selectAllNotificationTemplates);
    this.templates$.subscribe(list => {
      this.currentTemplates = list;
    });

    this.shouldDisplaySuccessMessage$ = this.healthPassStore.select(selectDisplayTemplateSuccessMessage);
    this.shouldDisplaySuccessMessage$.subscribe(hasSuccessMessage => {
      if (hasSuccessMessage) {
        this.resetModal();
        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18n.transform('t_changes_saved_ok')
          })
        );

        this.healthPassStore.dispatch(NotificationTemplatePageActions.initSuccessMessage());
      }
    });
  }

  ngOnInit(): void {
    this.healthPassStore.dispatch(NotificationTemplatePageActions.enter());
  }

  openEditModal(template: INotificationTemplate) {
    this.editModal = this.modalService.open(NotificationTemplateEditComponent, {
      data: template,
      onAction: this.onEdited.bind(this),
      onClose: this.resetModal.bind(this)
    });
  }

  onEdited(updatedTemplate: INotificationTemplate) {
    const updatedTemplates = this.currentTemplates.map((template) => template.type === updatedTemplate.type ? updatedTemplate : template);
    this.healthPassStore.dispatch(NotificationTemplatePageActions.edit({updatedTemplates}));
  }

  resetModal() {
    this.editModal.dispose();
  }

  templateTypeTitleProperty(type: number) {
    return 'contact_trace_notification_template_title_' +
      NotificationTemplateType[type].toLowerCase();
  }
}
