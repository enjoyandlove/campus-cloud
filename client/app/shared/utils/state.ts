function update(state, newState) {
  return Object.assign({}, state, newState);
};

function updateByKey(state, newValue: { key: any, value: any }) {
  return Object.assign({}, state, { newValue });
};

function append(state, object) {
  return [object, ...state];
};

function deleteById(state, key: string, id: any) {
  let _state = Object.assign({}, state);

  _state[key] = _state[key].filter(item => item.id !== id);

  return _state;
};

export const CPState = {
  update,
  append,
  deleteById,
  updateByKey
};
