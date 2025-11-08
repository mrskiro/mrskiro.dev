import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import Link, { LinkProps } from "next/link";

type Props =
  | ({
      isExternal: true;
    } & ComponentPropsWithoutRef<"a">)
  | ({
      isExternal?: false;
      isActive?: boolean;
    } & LinkProps);

// TODO: delete
export const AppLink = (props: PropsWithChildren<Props>) => {
  if (props.isExternal) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, isExternal, ...anchorProps } = props;
    return (
      <a
        className="cursor-pointer break-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        target="_blank"
        {...anchorProps}
      >
        {children}
      </a>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isActive, isExternal, children, ...linkProps } = props;
  return (
    <Link
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...linkProps}
      data-active={isActive ?? false}
      className="cursor-pointer underline-offset-4 data-[active=true]:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      {children}
    </Link>
  );
};
