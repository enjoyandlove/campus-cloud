# Bar Chart

> Bar chart component. [Check original library for more details](https://www.echartsjs.com/en/api.html)

---

```html
<ready-ui-bar-chart
  [colors]="colors"
  [yAxis]="yAxis"
  [series]="series">
</ready-ui-bar-chart>
```

---

## Import From
```typescript
import { ChartsModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-bar-chart`


## Inputs

- **Colors**

  Type `Array<HEX color codes>`

  Required `true`

  One color per series defined in the `series` `Input`

- **yAxis**

  Type `Object`

  Required `false`

  Options [View More](https://www.echartsjs.com/en/option.html#yAxis)

- **xAxis**

  Type `string`

  Required `false`

  Options [View More](https://www.echartsjs.com/en/option.html#xAxis)

- **series**

  Type `Array`

  Required `true`

  Options [View More](https://www.echartsjs.com/en/option.html#series)

  Example:
  ```
  [
    {
      type: 'bar',
      data: [1, 124, 32],
      name: 'Series Name'
    }
  ]
  ```


## Outputs

---

None


