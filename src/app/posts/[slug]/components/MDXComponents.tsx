import type { PropsWithChildren } from 'react';

const MDXComponents = {
  h2: ({ id, children }: PropsWithChildren<{ id?: string }>) => (
    <h2 id={id} className="text-foreground mt-10 mb-6 text-2xl font-bold">
      {children}
    </h2>
  ),
  h3: ({ id, children }: PropsWithChildren<{ id?: string }>) => (
    <h3 id={id} className="text-foreground mt-8 mb-6 text-xl font-semibold">
      {children}
    </h3>
  ),
  p: ({ children }: PropsWithChildren) => (
    <p className="text-foreground mt-6 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: PropsWithChildren) => (
    <ul className="text-foreground mt-6 list-inside [&_ul]:mt-0 [&_ul]:pl-4 [&_ul_ul]:pl-8">
      {children}
    </ul>
  ),
  ol: ({ children }: PropsWithChildren) => (
    <ol className="text-foreground mt-6 list-inside [&_ol]:mt-0 [&_ol]:pl-4 [&_ol_ol]:pl-8">
      {children}
    </ol>
  ),
  li: ({ children }: PropsWithChildren) => (
    <li className="text-foreground mt-1">{children}</li>
  ),
  blockquote: ({ children }: PropsWithChildren) => (
    <blockquote className="border-border bg-muted/50 text-muted-foreground my-6 border-l-4 py-2 pl-4 [&_p]:mt-0">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: PropsWithChildren<{ href?: string }>) => {
    const isInternalLink = href?.startsWith('#');
    return (
      <a
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        {...(!isInternalLink && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    return (
      <figure className="my-8 block">
        <img
          src={src}
          alt=""
          className="mx-auto max-h-80 rounded-xs object-contain"
        />
        {alt && (
          <figcaption className="text-muted-foreground mt-4 block text-center text-sm">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  hr: () => <hr className="border-border my-8" />,
  table: ({ children }: PropsWithChildren) => (
    <div className="my-6 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: PropsWithChildren) => (
    <thead className="bg-muted">{children}</thead>
  ),
  tbody: ({ children }: PropsWithChildren) => <tbody>{children}</tbody>,
  tr: ({ children }: PropsWithChildren) => (
    <tr className="border-border border-b">{children}</tr>
  ),
  th: ({ children }: PropsWithChildren) => (
    <th className="border-border text-foreground border px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: PropsWithChildren) => (
    <td className="border-border text-foreground border px-4 py-2">
      {children}
    </td>
  ),
};

export default MDXComponents;
