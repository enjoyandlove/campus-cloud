# ColorPickerDirective

> Ready Color Picker ([pickr](https://github.com/Simonwep/pickr))

---

```html
<div ready-ui-color-picker></div>
```

---

## Import From
```typescript
import { ColorPickerModule } from '@ready-education/ready-ui';
```

## When to use it?
TODO


## Selector
`ready-ui-color-picker`


## Inputs

- **events**

  Type `string[]`

  Required `false`

  Array of event names to hook into it

- **default**

  Type `string`

  Default `#000000`

  Initial color for picker

- **appClass**

  Type `string`

  Default `ready-ui-color-picker'`

  Custom `CSS` class to be applied to picker

- **swatches**

  Type `string[]`

  Required `false`

  Array of `hex` color codes

- **theme**

  Type `string`

  Options `nano` `classic` `monolith`

  Default `classic`

  This requires including the theme's css in the `angular.json` file

- **position**

  Type `string`

  Options See original library for available options

  Default `bottom-end`

- **save**

  Type `boolean` `string`

  Default `true`

- **hex**

  Type `boolean` `string`

  Default `true`

- **hsla**

  Type `boolean` `string`

  Default `false`

- **hsva**

  Type `boolean` `string`

  Default `false`

- **rgba**

  Type `boolean` `string`

  Default `false`

- **cmyk**

  Type `boolean` `string`

  Default `false`

- **input**

  Type `boolean` `string`

  Default `true`

- **clear**

  Type `boolean` `string`

  Default `false`

- **hue**

  Type `boolean` `string`

  Default `true`

- **preview**

  Type `boolean` `string`

  Default `false`

- **opacity**

  Type `boolean` `string`

  Default `false`

## Outputs

- **pickr**

  type: `Object<{event: string, args: any}>`

  Required: `false` (only when `events` is passed)

  Event represents the native event name emitted by the library and the argumnets key will include all parameters sent by the library for that event



