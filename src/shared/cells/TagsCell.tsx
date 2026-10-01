// Port de tagChips (js/views/tags.js), lecture seule — l'édition (tagsCell legacy) demande son
// propre menu, pas encore porté.
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
