export function SiteHeader() {
  return (
    <header className="site-header">
      <div>
        <p className="brand">Next Project</p>
        <p className="subtitle">基础项目框架</p>
      </div>
      <nav className="nav">
        <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
          Docs
        </a>
        <a href="https://react.dev/" target="_blank" rel="noreferrer">
          React
        </a>
      </nav>
    </header>
  );
}
