# Ready UI library

[Storybook](http://readyeducation.surge.sh/)

## Installing:
`yarn i @ready-education/ready-ui`

### Ready UI Icon

Ready Icons are loaded via the ready ui icon component by referencing its name, all icons are added to the `src/lib/images-and-icons/icons/symbol/symbol.component.html`

The following steps describes how to add new icons to the Ready UI library:

1. Download the SVG you want to include to your computer
2. Open the file in your IDE
3. Replace `svg` with `symbol`
4. Remove all other attributes from the `svg`  tag including `xmlns`  `height`  and `width`
5. Make sure you add a unique `id` attribute to the `symbol`  tag
6. Copy the resulting HTML at the bottom of the `symbol.component.html`  before the closing `defs`

Most of our icons are coming from the [Icons - Material Design](https://material.io/resources/icons/?style=baseline)
