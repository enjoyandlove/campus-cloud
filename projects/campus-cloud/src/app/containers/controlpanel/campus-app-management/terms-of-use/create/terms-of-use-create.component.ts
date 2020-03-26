import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { PublishTermsModalComponent } from '../components';
import { TermsOfUseService } from '../terms-of-use.service';
import { baseActionClass, ISnackbar } from '@campus-cloud/store/base';
import { TermsOfUseUtilsService } from '../terms-of-use.utils.service';
import { TextEditorDirective } from '@ready-education/ready-ui/forms/text-editor';
import { CPI18nService, CPTrackingService, ModalService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-terms-of-use-create',
  templateUrl: './terms-of-use-create.component.html',
  styleUrls: ['./terms-of-use-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService],
  host: {
    class: 'cp-terms-of-use-create'
  }
})
export class TermsOfUseCreateComponent implements OnInit {
  @ViewChild('editor', { static: true }) editor: TextEditorDirective;

  termId;
  content;
  termsModal: OverlayRef;
  disableSubmit$ = new BehaviorSubject(true);

  constructor(
    private cpI18n: CPI18nService,
    private store: Store<ISnackbar>,
    public service: TermsOfUseService,
    private modalService: ModalService,
    private cpTracking: CPTrackingService
  ) {}

  showPublishTermsModal() {
    this.termsModal = this.modalService.open(
      PublishTermsModalComponent,
      {},
      { onClose: this.teardown.bind(this), onAction: this.publishTerms.bind(this) }
    );
  }

  teardown() {
    this.modalService.close(this.termsModal);
    this.termsModal = null;
    this.disableSubmit$.next(false);
  }

  resetTermsOfUse() {
    this.editor.quill.setContents(this.content);
    this.disableSubmit$.next(true);
  }

  publishTerms() {
    const body = TermsOfUseUtilsService.parseContentToAPI(this.editor.quill.getContents());

    this.service.postTerms(body, this.termId).subscribe(
      (res) => {
        this.content = TermsOfUseUtilsService.parseContentFromAPI(res);
        this.editor.quill.setContents(this.content);
        this.handleSuccess();
        this.disableSubmit$.next(true);
        this.cpTracking.amplitudeEmitEvent('Customize - Published Terms Of Use');
      },
      () => {
        this.handleError();
        this.disableSubmit$.next(true);
      }
    );
  }

  onTextChange() {
    this.editor.quill.getText().trim()
      ? this.disableSubmit$.next(false)
      : this.disableSubmit$.next(true);
  }

  handleSuccess() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('t_terms_of_use_published_successfully')
      })
    );
  }

  handleError() {
    this.disableSubmit$.next(false);
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  fetch() {
    this.service.getTerms().subscribe(
      (terms) => {
        this.termId = terms['id'];
        this.content = terms ? TermsOfUseUtilsService.parseContentFromAPI(terms) : [];
        this.editor.quill.setContents(this.content);
      },
      () => {
        this.handleError();
        this.disableSubmit$.next(true);
      }
    );
  }

  ngOnInit() {
    this.fetch();
  }
}
