# TableComponent

> Default HTML table with Ready styles

---

```html
<table ui-table>
  <thead>
    <tr ui-table-row>
      <th ui-table-cell>Name</th>
      <th ui-table-cell>Email</th>
      <th ui-table-cell></th>
    <tr>
  </thead>
  <tbody>
    <tr ui-table-row>
      <td ui-table-cell>Jane</td>
      <td ui-table-cell>jane@email.com</td>
      <td ui-table-cell align="right">
        <button ui-button variant="inline" color="primary">Save</button>
      </td>
    </tr>
  <tbody>
</table>
```
**Change Detection: on Push**

**View Encapsulation: None**

---

## Import From
```typescript
import { TableModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`table[ui-table]`


## Inputs

---

None

## Outputs

---

None

# TableRowComponent

> Default HTML table row with Ready styles

---

```html
<tr ui-table-row>
  <!-- Content -->
</<tr>
```
**Change Detection: on Push**

**View Encapsulation: None**

---

## Import From
```typescript
import { TableModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`tr[ui-table-row]`


## Inputs

---

None

## Outputs

---

None


# TableCellComponent

> Default HTML table cell with Ready styles

---

```html
<th ui-table-cell>Name</th>
<!-- or --->
<td ui-table-cell>Name</td>
```

**Change Detection: on Push**

**View Encapsulation: None**

---

## Import From
```typescript
import { TableModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`td[ui-table-cell], th[ui-table-cell]`


## Inputs

- **sorting**

  Type `boolean` || `string`

  Required `false`

  Default `false`

- **align**

  Type `string`

  Required `false`

  Default `left`

  Options `left`, `center`, `right`

- **sortDirection**

  Type `string`

  Required `false`

  Default `desc`

  Options `asc`, `desc`


## Outputs

- **sort**

  Type `string`

  Options `asc`, `desc`



