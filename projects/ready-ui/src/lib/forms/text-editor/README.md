# TextEditorDirective

> Ready text editor directive ([quill](https://quilljs.com/))

---

```html
<div ready-ui-text-editor></div>
```

---

## Import From
```typescript
import { TextEditorModule } from '@ready-education/ready-ui/forms';
```

## Export As
`ui-editor`

## When to use it?
TODO


## Selector
`ready-ui-text-editor`


## Inputs

- **theme**

  Type `string`

  Options `snow` `bubble`

  Default `snow`

  Required `false`

  This requires including the theme's css in the `angular.json`


- **toolbar**

  Type `boolean` `any`

  Required `false`

  Default `true`

  Check original library for options

- **events**

  Type `string[]`

  Required `false`

  Check original library for options

- **placeholder**

  Type `string`

  Required `false`

- **readOnly**

  Type `string` `boolean`

  Required `false`


## Outputs

---

- **editor**
  Type `{ event: string; args: any[] }`

  When the input `events` is passed, the `event` name matches the library's original evnt name and the `args` key will return the respective arguments returned by the library



