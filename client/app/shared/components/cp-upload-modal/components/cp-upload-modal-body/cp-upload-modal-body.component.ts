import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { CPI18nService } from './../../../../services/i18n.service';

const FIVE_MB = 5e6;

@Component({
  selector: 'cp-upload-modal-body',
  templateUrl: './cp-upload-modal-body.component.html',
  styleUrls: ['./cp-upload-modal-body.component.scss']
})
export class CPUploadModalBodyComponent implements OnInit {
  @Input() props;
  @Input() reset: Observable<boolean>;
  @Input() instruction = 'csv_modal_instruction';

  @Output() ready: EventEmitter<null> = new EventEmitter();

  state = {
    ready: false,
    error: false,
    fileName: null,
    processing: false,
    errorMessage: null
  };

  constructor(public cpI18n: CPI18nService) {}

  resetValues() {
    this.state = {
      ...this.state,
      ready: false,
      error: false,
      fileName: null,
      processing: false,
      errorMessage: null
    };
  }

  validator(file) {
    const result = [];
    const validators = [
      {
        exp: this.props.validExtensions.indexOf(file.name.split('.').pop()) === -1,
        error: this.cpI18n.translate('error_invalid_extension'),
        isError: false
      },
      {
        exp: file.size > FIVE_MB,
        error: this.cpI18n.translate('error_file_is_too_big'),
        isError: false
      }
    ];

    validators.map((validator) => {
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

    if (!file.target.files.length) {
      return;
    }

    const _file = file.target.files[0];

    const errors = this.validator(_file)[0];

    if (errors) {
      this.state = {
        ...this.state,
        error: true,
        errorMessage: errors.error
      };

      return;
    }

    this.state = {
      ...this.state,
      fileName: _file.name,
      processing: true
    };

    // reset input value
    file.target.value = null;

    this.props
      .parser(_file)
      .then((_) => {
        this.state = {
          ...this.state,
          ready: true,
          processing: false
        };

        this.ready.emit();
      })
      .catch((err) => {
        this.state = {
          ...this.state,
          error: true,
          processing: false,
          errorMessage: err
        };
      });
  }

  ngOnInit(): void {
    this.reset.subscribe((reset) => {
      if (reset) {
        this.resetValues();
      }
    });
  }
}
