# StackComponent

> Component to align elements in it

**Change Detection:** On Push

**View Encapsulation:** None

---

```html
<ready-ui-stack
  [spacing]="spacing"
  [alignment]="alignment"
  [direction]="direction">
    <!-- content -->
</ready-ui-stack>
```

---

## Import From
```typescript
import { StackModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-stack`


## Inputs

- **direction**

  Type `string`

  Required `false`

  Default `horizontal`

  Options `horizontal`, `vertical`

- **alignment**

  Type `string`

  Required `false`

  Default `start`

  Options `start`, `end`, `center`, `even`, `between`

- **spacing**

  Type `string`

  Required `false`

  Default `regular`

  Options `tight`, `regular`, `loose`

  Only applied to `alignment`s `start`, `end` and `center`


## Outputs

---

None

