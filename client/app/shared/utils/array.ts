function inArray(item: any, arr: any[]) {
  return arr.indexOf(item) > -1;
};

function last(arr: any[]) {
  return arr.pop();
};

function isObjectInArray(key, arr, value) {
  let result = false;

  arr.forEach(item => {
    if (item[key] === value) {
      result = true;
    }
  });
  // console.log(result);
  return result;
};

function removeByIndex(arr, index) {
  arr.splice(index, 1);
};

export const CPArray = {
  last,
  inArray,
  removeByIndex,
  isObjectInArray
};


