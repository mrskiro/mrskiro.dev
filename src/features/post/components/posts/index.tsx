import { Post } from "../../types/post";
import { PostItem } from "./post-item";

type Props = {
  posts: Post[];
};

export const Posts = (props: Props) => (
  <ul className="flex flex-col gap-4">
    {props.posts.map((v) => (
      <li key={v.id}>
        <PostItem
          type={v.type}
          title={v.title}
          link={v.link}
          createdAt={v.createdAt}
        />
      </li>
    ))}
  </ul>
);
