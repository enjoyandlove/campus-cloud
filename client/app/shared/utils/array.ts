const inArray = function inArray(item: any, arr: any[]) {
  return arr.indexOf(item) > -1;
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

export const cpArray = {
  inArray,
  removeByIndex,
  isObjectInArray
};


