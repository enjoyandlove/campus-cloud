import { ReadyUiModule } from '@ready-education/ready-ui';
import {
  ModalService,
  READY_MODAL_DATA
} from '@ready-education/ready-ui/overlays/modal/modal.service';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { centered } from '@storybook/addon-centered/angular';
import { Component, TemplateRef, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'ready-ui-modal-component',
  styles: [
    `
      .wrapper {
        padding: 1em;
      }
      header {
        padding-bottom: 1em;
      }
      footer {
        padding-top: 1em;
        border-top: 1px solid #eee;
      }
      main {
        padding: 2em 0;
      }
    `
  ],
  template: `
    <div class="wrapper">
      <header>
        <ready-ui-stack alignment="between">
          Title
          <button ui-button type="button" variant="inline" (click)="data.onClose()">
            <ready-ui-icon name="close" size="small"></ready-ui-icon>
          </button>
        </ready-ui-stack>
      </header>
      <main>
        Modal Content
      </main>
      <footer>
        <ready-ui-stack alignment="end">
          <button ui-button type="button" variant="flat" (click)="data.onCancel()">
            Cancel
          </button>
          <button ui-button type="button" color="danger" variant="flat" (click)="data.onDelete()">
            Delete
          </button>
        </ready-ui-stack>
      </footer>
    </div>
  `
})
export class ReadyUIModalComponent {
  constructor(@Inject(READY_MODAL_DATA) private data) {}
  onCancelClick() {
    alert('Cancel');
  }

  onDeleteClick() {
    alert('Delete');
  }

  onCloseClick() {
    alert('Close');
  }
}
// needed in order to add entryComponent
@Component({
  selector: 'ready-ui-modal-wrapper',
  providers: [ModalService],
  styles: [
    `
      .wrapper {
        padding: 1em;
      }
      button:not(:last-child) {
        margin-right: 1em;
      }
    `
  ],
  template: `
    <button ui-button type="button" (click)="templateModal(modal)">Template Modal</button>
    <button ui-button type="button" (click)="componentModal()">Component Modal</button>
    <ng-template #modal let-data
      ><div class="wrapper">Template for {{ data.event.name }}</div></ng-template
    >
  `
})
export class ReadyUIModalWrapperComponent {
  _modal;
  constructor(private service: ModalService) {}

  onClose() {
    this.alert('onClose');
    this._modal.dispose();
  }

  onCancel() {
    this.alert('onCancel');
    this._modal.dispose();
  }

  onDelete() {
    this.alert('onDelete');
    this._modal.dispose();
  }

  alert(source: string) {
    alert(source);
  }

  componentModal() {
    this._modal = this.service.open(ReadyUIModalComponent, {
      hello: 'World',
      onClose: this.onClose.bind(this),
      onCancel: this.onCancel.bind(this),
      onDelete: this.onDelete.bind(this)
    });
  }

  templateModal(template: TemplateRef<any>) {
    this._modal = this.service.open(template, {
      event: {
        name: 'Movies Friday'
      }
    });
  }
}

storiesOf('Overlays/Modal', module)
  .addDecorator(
    moduleMetadata({
      entryComponents: [ReadyUIModalComponent],
      declarations: [ReadyUIModalWrapperComponent, ReadyUIModalComponent],
      imports: [ReadyUiModule]
    })
  )
  .addDecorator(centered)
  .add('Modal', () => {
    return {
      props: {},
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <ready-ui-modal-wrapper></ready-ui-modal-wrapper>
    `
    };
  });
