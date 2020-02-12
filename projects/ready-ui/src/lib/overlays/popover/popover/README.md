# PopoverComponent

> A popover component, to display content outside the regular document flow, opens below the `triggered` element (a clickable component using the `readyUiPopoverTrigger` directive).

*Directive docs below*

---

```html
<ready-ui-popover>
  <button
    ui-button
    type="button"
    [position]="position"
    readyUiPopoverTrigger
    [uiPopoverYOffset]="offset">Open</button>
  <!-- content -->
</ready-ui-popover>
```

---

## Import From
```typescript
import { PopoverModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-popover`


## Inputs

None


## Outputs

---

None

# PopoverTriggerDirective
> Used in conjunction with `PopoverComponent`

## Selector
`readyUiPopoverTrigger`

## Exported as
`popover`


## Inputs

- **uiPopoverTpl**

  Type TemplateRef<any>

  Required `false`

- **uiPopoverYOffset**

  Type `String | Number`

  Required `false`

  Default 40

  Popover offset on the vertical axis

- **position**

  Type `String `

  Required `false`

  Default: `left`

  Options `left`, `right`

  Popover alignment from the triggered element


## Outputs

---

None
