import { useEffect } from "react";

export const useKeyPressAction = (keys = {}) => {
  useEffect(() => {
    const listener = (event) => {
      Object.entries(keys).forEach(([key, action]) => {
        switch (event.key) {
          case "w":
          case "ArrowUp":
            if (key === "up") action();
            break;
          case "s":
          case "ArrowDown":
            if (key === "down") action();
            break;
          case "a":
          case "ArrowLeft":
            if (key === "left") action();
            break;
          case "d":
          case "ArrowRight":
            if (key === "right") action();
            break;
          default:
            if (key === event.key) action();
        }
      });
    };

    window.document.body.addEventListener("keyup", listener);
    return () => {
      window.document.body.removeEventListener("keyup", listener);
    };
  }, [keys]);
};
