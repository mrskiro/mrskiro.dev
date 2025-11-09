import * as React from "react";
import { ParagraphBlock, BlockMap } from "@/features/post/types/block";
import { RichText } from "./rich-text";

type Props = {
  block: ParagraphBlock;
  blockMap: BlockMap;
  children?: React.ReactNode;
};

export const Paragraph = (props: Props) => {
  return (
    <p className="mb-5">
      <RichText text={props.block.richText} />
      {props.children}
    </p>
  );
};
