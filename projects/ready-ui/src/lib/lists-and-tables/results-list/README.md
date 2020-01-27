# ResultsListComponent

> Ready results list, use togeter with `ResultItemComponent` and `ResultsListSectionComponent`

---

```html
<ready-ui-results-list [loading]="loading">
  <ready-ui-results-list-section name="Saved searches">
    <ready-ui-result-item
      [label]="search.value"
      [context]="search.context"
      *ngFor="let search of searches">
      <!-- ng-content -->
    </ready-ui-result-item>
  </ready-ui-results-list-section>
</ready-ui-results-list>
```
**Change Detection: On Push**

---

## Import From
```typescript
import { ResultsListModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-results-list`


## Inputs

- **loading**

  Type `boolean` `string`

  Required `false`


## Outputs

---

None


---

# ResultItemComponent

> Ready results list, use togeter with `ResultsListComponent` and `ResultsListSectionComponent`

---

```html
<ready-ui-result-item
  [label]="search.value"
  [context]="search.context"
  *ngFor="let search of searches">
  <!-- ng-content -->
</ready-ui-result-item>
```
**Change Detection: On Push**

---

## Import From
```typescript
import { ResultsListModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-result-item`


## Inputs

- **label**

  Type `string`

  Required `true`

- **disabled**

  Type `boolean` `string`

  Required `false`

- **highlight**

  Type `boolean`

  Required `false`

- **context**

  Type `object`

  Required `false`

  Used to pass the context to any of the accepted `ng-templates`

- **prefix**

  Type `TemplateRef`

  Required `false`

- **suffix**

  Type `TemplateRef`

  Required `false`


## Outputs

---

None


---

# ResultsListSectionComponent

> Ready results list, use togeter with `ResultItemComponent` and `ResultsListSectionComponent`

---

```html
<ready-ui-results-list-section name="Saved searches">
  <!-- ng-content -->
</ready-ui-results-list-section>
```
**Change Detection: On Push**

---

## Import From
```typescript
import { ResultsListModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-results-list-section`


## Inputs

- **name**

  Type `string`

  Required `false`


## Outputs

---

None

