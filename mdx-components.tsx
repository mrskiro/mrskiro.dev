import type { MDXComponents } from "mdx/types";

import { tcy } from "./src/lib/tcy";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mbs-14 mbe-4 font-semibold group-data-[tategaki]/tategaki:mbs-8" {...props}>
      {tcy(props.children)}
    </h2>
  ),
  h3: (props) => (
    <h3 className="mbs-10 mbe-3 font-semibold group-data-[tategaki]/tategaki:mbs-6" {...props}>
      {tcy(props.children)}
    </h3>
  ),
  h4: (props) => (
    <h4 className="mbs-8 mbe-2 font-semibold group-data-[tategaki]/tategaki:mbs-4" {...props}>
      {tcy(props.children)}
    </h4>
  ),
  strong: (props) => <strong className="font-normal text-accent" {...props} />,
  p: (props) => (
    <p className="mbe-4 leading-7 group-data-[tategaki]/tategaki:mbe-0 group-data-[tategaki]/tategaki:indent-4" {...props}>
      {tcy(props.children)}
    </p>
  ),
  ul: (props) => (
    <ul className="mbe-4 list-disc ps-6 leading-7 group-data-[tategaki]/tategaki:mbe-0" {...props} />
  ),
  ol: (props) => (
    <ol className="mbe-4 list-decimal ps-6 leading-7 group-data-[tategaki]/tategaki:mbe-0" {...props} />
  ),
  li: (props) => <li {...props}>{tcy(props.children)}</li>,
  blockquote: (props) => (
    <blockquote className="mbe-4 border-s-2 border-accent ps-4 [&>p]:mbe-0" {...props} />
  ),
  pre: (props) => (
    <pre
      className="mbe-4 overflow-x-auto bg-[#f6f6f6] p-4 text-sm leading-relaxed group-data-[tategaki]/tategaki:[writing-mode:horizontal-tb]"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="font-mono text-sm [:not(pre)>&]:bg-[#f6f6f6] [:not(pre)>&]:px-1.5 [:not(pre)>&]:py-0.5"
      {...props}
    />
  ),
  img: (props) => (
    <img
      className="group-data-[tategaki]/tategaki:max-h-[calc(100dvh-12rem)] group-data-[tategaki]/tategaki:w-auto"
      {...props}
    />
  ),
  hr: (props) => <hr className="mbs-12 mbe-12 border-bs border-[#f0f0f0]" {...props} />,
  table: (props) => (
    <table
      className="mbe-4 w-full border-collapse text-sm group-data-[tategaki]/tategaki:[writing-mode:horizontal-tb]"
      {...props}
    />
  ),
  th: (props) => (
    <th className="border-b border-[#f0f0f0] p-2 text-left font-semibold" {...props} />
  ),
  td: (props) => <td className="border-b border-[#f0f0f0] p-2 text-left" {...props} />,
};

export const useMDXComponents = (): MDXComponents => {
  return components;
};
