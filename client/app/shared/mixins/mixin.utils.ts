export function Mixin(mixinCtors: Function[]) {
  return function(classCtor: Function) {
    mixinCtors.forEach((mixinCtor: Function) => {
      Object.getOwnPropertyNames(mixinCtor.prototype).forEach((mixinFunction: string) => {
        classCtor.prototype[mixinFunction] = mixinCtor.prototype[mixinFunction];
      });
    });
  };
}
