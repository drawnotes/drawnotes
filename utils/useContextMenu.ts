import { RefObject, useCallback, useEffect, useState } from "react";

const useContextMenu = (ref: RefObject<HTMLDivElement>) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const handleContextMenu = useCallback(
    (event) => {
      const element = event.target as Element;
      if (ref.current && ref.current.contains(element)) {
        event.preventDefault();
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setShow(true);
      } else {
        setShow(false);
      }
    },
    [setShow, setAnchorPoint]
  );

  const handleClick = useCallback(() => show && setShow(false), [show]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { anchorPoint, show };
};

export default useContextMenu;
