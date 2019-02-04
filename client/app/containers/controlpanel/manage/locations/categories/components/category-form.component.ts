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

  categoryIcons = CategoryModel.categoryIcons();
  categoryIconColors = CategoryModel.categoryIconColors();

  constructor() {}

  onIconClick(icon) {
    this.form.get('img_url').setValue(icon);
  }

  onColorClick(color) {
    this.form.get('color').setValue(color);
  }

  onCategoryTypeSelect(type) {
    this.form.get('category_type_id').setValue(type.action);
  }

  get requiredControls() {
    return {
      name: this.form.get('name'),
      color: this.form.get('color'),
      icon: this.form.get('img_url'),
      type: this.form.get('category_type_id'),
    };
  }

  ngOnInit() {}
}
