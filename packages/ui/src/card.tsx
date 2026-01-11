export function Card({
  className,
  title,
  children,
  href = "",
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  // If href is empty, render as a div to allow interactive elements inside
  if (!href) {
    return (
      <div className={className}>
        <h2 className="text-sm">
          {title}
        </h2>
        <p>{children}</p>
      </div>
    );
  }

  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="text-sm">
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
