/**
 * 縦中横(text-combine-upright)処理
 * React childrenの中から連続2桁の数字を見つけてtext-combine-uprightを適用する
 */

import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const TCY_REGEX = /(?<!\d)(\d{2})(?!\d)/;

export const tcy = (children: ReactNode): ReactNode =>
  Children.map(children, (child) => {
    if (typeof child === "string") {
      const parts = child.split(TCY_REGEX);
      if (parts.length === 1) return child;
      return parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="[text-combine-upright:all] [-webkit-text-combine:horizontal]">
            {part}
          </span>
        ) : (
          part
        ),
      );
    }
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child, {}, tcy(child.props.children));
    }
    return child;
  });
