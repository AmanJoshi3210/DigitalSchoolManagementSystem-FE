import ReactMarkdown, { type Components } from 'react-markdown'
import { Link } from 'react-router-dom'

// Renders the assistant's markdown reply. react-markdown never renders raw HTML and strips
// unsafe URLs (javascript: etc.). Portal routes ("/student/...") become in-app router links.
export function AssistantMarkdown({ content, onNavigate }: { content: string; onNavigate?: () => void }) {
  const components: Components = {
    a: ({ href, children }) =>
      href?.startsWith('/') ? (
        <Link to={href} onClick={onNavigate} className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700">
          {children}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 underline underline-offset-2">
          {children}
        </a>
      ),
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
    strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
    h1: ({ children }) => <p className="mb-1 font-semibold text-slate-900">{children}</p>,
    h2: ({ children }) => <p className="mb-1 font-semibold text-slate-900">{children}</p>,
    h3: ({ children }) => <p className="mb-1 font-semibold text-slate-900">{children}</p>,
    code: ({ children }) => <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em]">{children}</code>,
  }

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>
}
