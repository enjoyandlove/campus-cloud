import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IItem } from '@campus-cloud/shared/components';
import { CategoryModel } from '../../model';

@Component({
  selector: 'cp-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() selectedCategory;
  @Input() formError: boolean;
  @Input() categoryTypes: IItem[];
  @Input() categoryIcons: Array<{ value: string; icon: string }>;

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
      type: this.form.get('category_type_id')
    };
  }

  ngOnInit() {}
}
