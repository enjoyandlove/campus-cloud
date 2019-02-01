import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CategoryModel } from '../model';
import { IItem } from '@shared/components';

@Component({
  selector: 'cp-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() selectedCategory;
  @Input() formError: boolean;
  @Input() categoryTypes$: Observable<IItem[]>;

  categoryIcons;
  categoryIconsColors;

  constructor() {}

  onUploadedImage(image) {
    this.form.get('img_url').setValue(image ? image : '');
  }

  onCategoryTypeSelect(type) {
    this.form.get('category_type_id').setValue(type.action);
  }

  get requiredControls() {
    return {
      name: this.form.get('name'),
      type: this.form.get('category_type_id'),
    };
  }

  ngOnInit() {
    this.categoryIcons = CategoryModel.categoryIcons();
    this.categoryIconsColors = CategoryModel.categoryIconsColors();
  }
}
