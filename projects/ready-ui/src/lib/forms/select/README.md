# SelectComponent

> Ready select component, use together with `ready-ui-option-group` (optional) and `ready-ui-option`

---

```html
<ready-ui-select label="Select a Host" formControlName="store_id">
  <ready-ui-option-group label="Clubs">
    <ready-ui-option
      value="2"
      disabled="false"
      label="Chess Club">
      <!-- ng-content -->
    </ready-ui-option>
  </ready-ui-option-group>
</ready-ui-select>
```
**Implements ControlValueAccessor**

---

## Import From
```typescript
import { SelectModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-select`


## Inputs

- **label**

  Type `string`

  Required `true`

- **id**

  Type `string` `number`

  Required `false`

- **ariaLabelledBy**

  Type `string`, `number`

  Required `false`

## Outputs


None

---

# OptionGroupComponent

> Ready option group component, used to group `ready-ui-option` elements

---

```html
<ready-ui-option-group label="Clubs">
  <!-- ng-content -->
</ready-ui-option-group>
```
---

## Import From
```typescript
import { SelectModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-option-group`


## Inputs

- **label**

  Type `string`

  Required `true`

## Outputs

None


---


# OptionComponent

> Ready option component

---

```html
<ready-ui-option
  value="2"
  label="Chess Club">
  <!-- ng-content -->
</ready-ui-option>
```
---

## Import From
```typescript
import { SelectModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-option-group`


## Inputs

- **label**

  Type `string`

  Required `true`

- **value**

  Type `string`

  Required `true`

- **selected**

  Type `string` `boolean`

  Required `false`

- **disabled**

  Type `string` `boolean`

  Required `false`

## Outputs

None

