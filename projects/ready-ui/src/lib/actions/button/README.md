# Button

> Default HTML button accepts all attributes a regular HTML buton does

---

```html
<button
    ui-button
    type="button"
    [color]="color"
    [variant]="variant"
    type="button">Save</button>
```

---

## Import From
```typescript
import { ButtonModule } from '@ready-education/ready-ui';
```


## Selector
`button[ui-button]`


## Inputs

- Color

  **Type** `string`

  **Required** `false`

  **Options** `primary`, `danger`, `warning`, `default`, `white`

- Variant

  **Type** `string`

  **Required** `false`

  **Options** `stroked`, `flat`, `basic`, `inline`


## Outputs

---

None

