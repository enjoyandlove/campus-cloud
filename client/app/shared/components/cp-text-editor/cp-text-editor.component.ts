import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import 'node_modules/quill/dist/quill.core.css';
import 'node_modules/quill/dist/quill.snow.css';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CPI18nService } from '../../services/index';

interface IState {
  body: string;
  image: string;
}

const state: IState = {
  body: null,
  image: null,
};

const Quill = require('quill');

@Component({
  selector: 'cp-text-editor',
  templateUrl: './cp-text-editor.component.html',
  styleUrls: ['./cp-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPTextEditorComponent implements OnInit, AfterViewInit {
  @Input() image$: Subject<string>;
  @Input() reset$: Subject<boolean>;
  @Output() contentChange: EventEmitter<IState> = new EventEmitter();
  @ViewChild('editor') editor: ElementRef;

  quillInstance;
  state: IState = state;

  constructor(private cpI18n: CPI18nService) {}

  ngAfterViewInit() {
    this.launch();
  }

  launch() {
    const toolbarOptions = null;

    this.quillInstance = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: this.cpI18n.translate('feeds_input_placeholder'),
      theme: 'snow',
    });

    this.quillInstance.on('text-change', () => {
      this.state = Object.assign({}, this.state, {
        body: this.quillInstance.getText().trim(),
      });
      this.contentChange.emit(this.state);
    });
  }

  removeText() {
    this.state = Object.assign({}, this.state, { body: null });
    this.quillInstance.setText('');
  }

  reset() {
    this.removeText();
  }

  clearImages(data: Array<any>) {
    const res = [];
    data.map((item) => {
      if (typeof item.insert !== 'object') {
        res.push(item);
      }
    });

    return res;
  }

  setImage(image) {
    this.state = Object.assign({}, this.state, { image });
  }

  ngOnInit() {
    if (!this.image$) {
      return Observable.of(null);
    }

    this.reset$.subscribe((reset) => {
      if (reset) {
        this.reset();
      }
    });

    this.image$.subscribe((image: string) => {
      if (image) {
        const content = this.quillInstance.getContents();
        this.setImage(image);

        // delete old image if any
        this.quillInstance.setContents(this.clearImages(content.ops));

        // set new content with no image
        const range = this.quillInstance.getSelection(true);
        this.quillInstance.insertEmbed(range.index, 'image', image);
      }

      this.setImage(null);
    });
  }
}
