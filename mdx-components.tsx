import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-14 mb-4 font-medium" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-3 font-medium" {...props} />,
  h4: (props) => <h4 className="mt-8 mb-2 font-medium" {...props} />,
  strong: (props) => <strong className="font-normal text-accent" {...props} />,
  p: (props) => <p className="mb-4 leading-7" {...props} />,
  ul: (props) => <ul className="mb-4 list-disc pl-6 leading-7" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal pl-6 leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote className="mb-4 border-l-2 border-accent pl-4 [&>p]:mb-0" {...props} />
  ),
  pre: (props) => (
    <pre className="mb-4 overflow-x-auto bg-[#f6f6f6] p-4 text-sm leading-relaxed" {...props} />
  ),
  code: (props) => (
    <code
      className="font-mono text-sm [:not(pre)>&]:bg-[#f6f6f6] [:not(pre)>&]:px-1.5 [:not(pre)>&]:py-0.5"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-12 border-t border-[#f0f0f0]" {...props} />,
  table: (props) => <table className="mb-4 w-full border-collapse text-sm" {...props} />,
  th: (props) => <th className="border-b border-[#f0f0f0] p-2 text-left font-medium" {...props} />,
  td: (props) => <td className="border-b border-[#f0f0f0] p-2 text-left" {...props} />,
};

export const useMDXComponents = (): MDXComponents => {
  return components;
};
