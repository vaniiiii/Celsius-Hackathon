import { writable, type Writable } from "svelte/store";

export const local_store = (key: string, initial: string): Writable<string> => {
  const toString = (value) => JSON.stringify(value, null, 2);
  const toObj = JSON.parse;

  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, toString(initial));
  }

  const saved = localStorage.getItem(key);

  const { subscribe, set, update } = writable(saved);

  return {
    subscribe,
    set: (value: string) => {
      localStorage.setItem(key, value);
      return set(value);
    },
    update,
  };
};
