# Line Chart

> Line chart component. [Check original library for more details](https://www.echartsjs.com/en/api.html)

---

```html
<ready-ui-line-chart
  [colors]="colors"
  [series]="series"
  [xLabels]="xLabels"
></ready-ui-line-chart>
```

---

## Import From
```typescript
import { ChartsModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-line-chart`


## Inputs

- **Colors**

  Type `Array<HEX color codes>`

  Required `true`

  Options

- **xLabels**

  Type `Array<string>`

  Required `false`

  Options [View More](https://www.echartsjs.com/en/option.html#yAxis)

- **series**

  Type `Array`

  Required `true`

  Options [View More](https://www.echartsjs.com/en/option.html#series)

  Example:
  ```
  [
    {
      type: 'line',
      data: [1, 124, 32],
      name: 'Series Name'
    }
  ]
  ```


## Outputs

---

None


