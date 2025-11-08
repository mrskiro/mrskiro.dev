import { TwoColumn } from "@/layouts/two-column";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  return (
    <TwoColumn>
      <p>このページは削除されているか、URLが間違っている可能性があります。</p>
    </TwoColumn>
  );
}
