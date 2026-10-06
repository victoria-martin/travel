export function TagsCell({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <span className="tag-chips">
      {tags.map((tag) => (
        <span className="tag-chip" key={tag}>
          {tag}
        </span>
      ))}
    </span>
  );
}
