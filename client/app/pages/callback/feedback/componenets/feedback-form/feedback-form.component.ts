import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'cp-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
  @Input() isEvent: boolean;
  @Input() isService: boolean;
  @Output() send: EventEmitter<any> = new EventEmitter();

  feedbackForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  onRate(rating: number): void {
    this.feedbackForm.controls['user_rating_percent'].setValue((rating / 5) * 100);
  }

  onSubmit(): void {
    this.send.emit(this.feedbackForm.value);
  }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      'user_feedback_text': [null, Validators.required],
      'user_rating_percent': [null, Validators.required],
    });
  }
}
