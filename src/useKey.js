
import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      document.addEventListener("keydown", function (e) {
        if (e.key === key) {
          action();
        }
      });

      return function () {
        document.removeEventListener("keydown", function (e) {
          if (e.key === key) {
            onclose();
          }
        });
      };
    },

    [action]
  );
}
