import type { DependencyList } from "react";
import { useMemo } from "react";

import { Skia } from "../Skia";

import type { Paint } from "./Paint";

/**
 * Returns a Skia Paint object
 * */
export const usePaint = (
  initializer?: (path: Paint) => void,
  deps?: DependencyList
) =>
  useMemo(() => {
    const p = Skia.Paint();
    p.setAntiAlias(true);
    if (initializer) {
      initializer(p);
    }
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
