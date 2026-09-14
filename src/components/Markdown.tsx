import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

// Phase 1 §12 — CMS markdown fields render through this, never raw
// dangerouslySetInnerHTML. Used for Profile.longBio, Research.content,
// BlogPost.content, Project.fullDescription.

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
    </div>
  );
}
