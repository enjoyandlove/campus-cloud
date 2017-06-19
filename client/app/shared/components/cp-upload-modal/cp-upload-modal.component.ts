import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { STATUS } from '../../../shared/constants';

const FIVE_MB = 5e6;

interface IOptions {
  parser: Function; // Promise
  templateUrl: string;
  validExtensions: Array<string>;
}

@Component({
  selector: 'cp-upload-modal',
  templateUrl: './cp-upload-modal.component.html',
  styleUrls: ['./cp-upload-modal.component.scss']
})
export class CPUploadModalComponent implements OnInit {
  @Input() props: IOptions;
  @Output() navigate: EventEmitter<null> = new EventEmitter();

  isError;
  isReady;
  fileName;
  processing;
  errorMessage;

  constructor() { }

  resetValues() {
    this.isReady = false;
    this.isError = false;
    this.fileName = null;
    this.processing = false;
  }

  validator(file) {
    let result = [];
    let validators = [
      {
        'exp': this.props.validExtensions.indexOf(file.name.split('.').pop()) === -1,
        'error': STATUS.WRONG_EXTENSION,
        'isError': false
      },
      {
        'exp': file.size > FIVE_MB,
        'error': STATUS.FILE_IS_TOO_BIG,
        'isError': false
      }
    ];

    validators.map(validator => {
      if (validator.exp) {
        validator.isError = true;
        result.push(validator);
      }
      return validator;
    });
    return result;
  }

  onChange(file) {
    this.resetValues();

    if (!file.target.files.length) { return; }

    let _file = file.target.files[0];

    let errors = this.validator(_file)[0];

    if (errors) {
      this.isError = true;
      this.errorMessage = errors.error;
      return;
    }

    this.fileName = _file.name;
    this.processing = true;

    // reset input value
    file.target.value = null;

    this.props.parser(_file)
      .then(_ => {
        this.isReady = true;
        this.processing = false;
      })
      .catch(err => {
        this.isError = true;
        this.processing = false;
        this.errorMessage = err;
      });
  }

  onNavigate() {
    this.navigate.emit();
    this.resetValues();
  }

  ngOnInit() {
    if (this.props === undefined) {
      console.warn('Missing Options Input');
    }
  }
}
