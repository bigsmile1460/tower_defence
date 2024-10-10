// localStorage 처리 함수
export function getLocalStorage(item) {
  if (typeof item != "string") {
    return localStorage.getItem(item);
  } else {
    return JSON.parse(localStorage.getItem(item));
  }
}

export function setLocalStorage(item, value) {
  localStorage.setItem(item, JSON.stringify(value));
  return;
}

export function clearLocalStorage(item) {
  localStorage.clear();
  return;
}
