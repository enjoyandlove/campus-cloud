import { Injectable } from '@angular/core';
import { Delta } from 'quill';

const Quill = require('quill');

const defaultOptions = {
  theme: 'snow',
};

@Injectable()
export class QuillService {
  editor;

  constructor(container, options = defaultOptions) {
    this.editor = new Quill(container, options);
  }

  private clearImages(data) {
    const res = [];

    data.map((item) => {
      if (typeof item.insert !== 'object') {
        res.push(item);
      }
    });

    return res;
  }

  reset() {
    this.editor.setText('');
  }

  getText(): string {
    return this.editor.getText().trim();
  }

  getSelection(focus = false) {
    return this.editor.getSelection(focus);
  }

  on(eventName, callback): Function {
    return this.editor.on(eventName, callback);
  }

  insertImage(image): Delta {
    const content = this.editor.getContents();

    // delete old image if any
    this.editor.setContents(this.clearImages(content.ops));

    const range = this.editor.getSelection(true);

    return this.editor.insertEmbed(range.index, 'image', image);
  }
}
