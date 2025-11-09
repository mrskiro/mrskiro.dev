"use client";

import { PropsWithChildren } from "react";
import { Switcher } from "@/features/theme/components/switcher";
import { TableOfContents } from "@/features/post/components/table-of-contents";
import { Block } from "@/features/post/types/block";
import { Footer } from "./footer";
import { Header } from "./header";

type Props = {
  headings: Block[];
};

export const ThreeColumn = (props: PropsWithChildren<Props>) => (
  <div className="relative min-h-screen pt-16 pb-6 px-5 lg:pt-32">
    <div className="absolute top-0 right-8">
      <Switcher />
    </div>

    <div className="max-w-5xl mx-auto md:grid md:grid-flow-row gap-6 md:grid-cols-12">
      <div className="md:sticky md:top-12 md:h-fit md:col-span-2">
        <Header />
      </div>

      <main className="pb-52 md:col-span-10 lg:col-span-8">
        {props.children}
      </main>

      <aside className="sticky top-16 h-fit hidden lg:block lg:col-span-2">
        <TableOfContents headings={props.headings} />
      </aside>
    </div>

    <hr className="mt-6 mb-4 border-t border-border" />

    <Footer />
  </div>
);
