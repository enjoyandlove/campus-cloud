const inArray = function inArray(item: any, arr: any[]) {
  return arr.indexOf(item) > -1;
};

const last = function last(arr: any[]) {
  return arr.pop();
};

const isObjectInArray = function isObjectInArray(key, arr, value) {
  let result = false;

  arr.forEach(item => {
    if (item[key] === value) {
      result = true;
    }
  });
  // console.log(result);
  return result;
};

const removeByIndex = function removeByIndex(arr, index) {
  arr.splice(index, 1);
};

export const CPArray = {
  last,
  inArray,
  removeByIndex,
  isObjectInArray
};


