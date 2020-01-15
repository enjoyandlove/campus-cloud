# IconComponent

> SVG icons from [Material Design](https://material.io/resources/icons/). Depends on `ready-ui-symbol` being present in the document (include in your application's root component once)

*Not all icons may be implemented, if missing make sure to add the svg code from the missing icon in `SymbolComponent`'s template*

---

```html
<ready-ui-icon [name]="name" [size]="size" [color]="color"></ready-ui-icon>
```

---

## Import From
```typescript
import { IconsModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-icon`


## Inputs

- **Name**

  Type `string`

  Required `true`

  Must match an ID from the Material Design list

- **Size**

  Type `string`

  Required `false`

  Default `regular`

  Options `small`, `regular`

- **Color**

  Type `string`

  Required `false`

  Default `0d0d0d`

  HEX code color without the `#`


## Outputs

---

None

### Availble Icons
`cloud_upload`
`today`
`info`
`link`
`thumb_up`
`mode_comment`
`expand_more`
`arrow_downward`
`arrow_upward`
`close`
`search`

