import { useState, useEffect } from "react";

export function useLocalStoragestate(initialState, key) {
  const [value, setvlaue] = useState(function () {
    const storedvalue = localStorage.getItem(key);
    return storedvalue ? JSON.parse(storedvalue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setvlaue];
}
