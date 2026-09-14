"use client";

import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CloudLogo from "@/components/CloudLogo";
import { achievements, blogs, contacts, experiences, journey, portfolioFiles, profile, rootFiles } from "@/data/portfolio";
import { calculateExperienceDuration } from "@/lib/experienceDuration";

type OutputItem = {
  id: number;
  command?: string;
  path?: string;
  confirmation?: boolean;
  content: ReactNode;
};

type PendingNavigation = {
  target: string;
};

const HOME = `/home/${profile.alias}`;
const DIRECTORIES = [...Object.keys(portfolioFiles), "blogs"];
const COMMANDS = ["help", "whoami", "pwd", "ls", "cd", "cat", "tree", "open", "history", "date", "clear", "exit"];
const HEADER_MOTTOS = ["LEARN TO HACK", "HACK TO LEARN"];
const LEAVE_HOME_WARNING = "WTF? Where are you going? Nothing here? Wanna continue?";

type VirtualEntry = { name: string; type: "directory" | "file" };

/**
 * Single source of truth for directory listings and path autocomplete.
 * Add future static files to PORTFOLIO_FILES; blog filenames are derived from
 * the blog data automatically.
 */
function getDirectoryEntries(targetPath: string): VirtualEntry[] | null {
  if (targetPath === "/") {
    return [
      { name: "home", type: "directory" },
      ...Object.keys(rootFiles).map((name) => ({ name, type: "file" as const })),
    ];
  }
  if (targetPath === "/home") return [{ name: profile.alias, type: "directory" }];
  if (targetPath === HOME) return DIRECTORIES.map((name) => ({ name, type: "directory" }));
  if (targetPath === `${HOME}/blogs`) return blogs.map((blog) => ({ name: `${blog.slug}.blog`, type: "file" }));

  const directory = targetPath.slice(HOME.length + 1) as keyof typeof portfolioFiles;
  const files = portfolioFiles[directory];
  return files ? files.map((name) => ({ name, type: "file" })) : null;
}

function longestCommonPrefix(values: string[]) {
  if (!values.length) return "";
  return values.reduce((prefix, value) => {
    let length = 0;
    while (length < prefix.length && length < value.length && prefix[length] === value[length]) length += 1;
    return prefix.slice(0, length);
  });
}

const HelpOutput = () => (
  <div className="help-output">
    <p className="output-heading">AVAILABLE COMMANDS</p>
    <div className="command-grid">
      <code>whoami</code><span>display the current visitor</span>
      <code>pwd</code><span>print the current directory</span>
      <code>ls [path]</code><span>list directory contents</span>
      <code>cd &lt;path&gt;</code><span>change the current directory</span>
      <code>cat &lt;file&gt;</code><span>read a file or open a .blog post</span>
      <code>tree</code><span>visualize the portfolio structure</span>
      <code>open &lt;item&gt;</code><span>open a contact link or blog post</span>
      <code>history</code><span>show command history</span>
      <code>date</code><span>print the local date and time</span>
      <code>clear</code><span>clear the terminal</span>
      <code>exit</code><span>close this session</span>
    </div>
    <p className="hint-line">Tip: use <kbd>Tab</kbd> to autocomplete and <kbd>↑</kbd> <kbd>↓</kbd> for history.</p>
  </div>
);

const Welcome = () => (
  <section className="welcome" aria-label="Welcome banner">
    <div className="eyebrow"><span /> SYSTEM READY · PORTFOLIO v1.0</div>
    <h1>
      <span>WELCOME TO MY</span>
      <strong>PORTFOLIO<span className="cursor-block" aria-hidden="true" /></strong>
    </h1>
    <div className="identity-line">
      <span className="identity-name">{profile.name}</span>
      <span className="identity-divider">/</span>
      <span className="identity-alias">{profile.alias}</span>
      <span className="identity-divider">/</span>
      <span>{profile.role}</span>
    </div>
    <p className="welcome-help">Type <button type="button" data-command="help">&quot;help&quot;</button> for more information.</p>
  </section>
);

function Prompt({ path }: { path: string }) {
  const shortPath = path === HOME ? "~" : path.startsWith(`${HOME}/`) ? `~/${path.slice(HOME.length + 1)}` : path;
  return (
    <span className="prompt" aria-hidden="true">
      <span className="prompt-user">guest@{profile.alias}</span>
      <span className="prompt-separator">:</span>
      <span className="prompt-path">{shortPath}</span>
      <span className="prompt-symbol">$</span>
    </span>
  );
}

function ConfirmationPrompt() {
  return <span className="confirmation-prompt">{LEAVE_HOME_WARNING} <span>[y/n]</span></span>;
}

function ClickableCommand({ command, children, className = "" }: { command: string; children: ReactNode; className?: string }) {
  return <button type="button" className={`terminal-link ${className}`} data-command={command}>{children}</button>;
}

function TreeOutput() {
  return (
    <pre className="tree-output" aria-label="Portfolio directory tree">
      <span className="tree-root">{profile.alias}/</span>{"\n"}
      {DIRECTORIES.map((directory, directoryIndex) => {
        const isLastDirectory = directoryIndex === DIRECTORIES.length - 1;
        const entries = getDirectoryEntries(`${HOME}/${directory}`) ?? [];
        return (
          <span key={directory}>
            {isLastDirectory ? "└" : "├"}── <span className="dir">{directory}/</span>{"\n"}
            {entries.map((entry, entryIndex) => (
              <span key={entry.name}>{isLastDirectory ? "    " : "│   "}{entryIndex === entries.length - 1 ? "└" : "├"}── <span className={entry.name.endsWith(".blog") ? "blog-file" : "file"}>{entry.name}</span>{directoryIndex < DIRECTORIES.length - 1 || entryIndex < entries.length - 1 ? "\n" : ""}</span>
            ))}
          </span>
        );
      })}
    </pre>
  );
}

function ExperienceHighlight({ highlight }: { highlight: string }) {
  const match = highlight.match(/^\[(LEARN|BUILD|RESEARCH)\]\s*/);
  if (!match) return <span className="experience-highlight-text">{highlight}</span>;

  const flag = match[1].toLowerCase();
  return (
    <>
      <span className={`experience-flag is-${flag}`}>{match[0].trim()}</span>
      <span className="experience-highlight-text">{highlight.slice(match[0].length)}</span>
    </>
  );
}

function ExperienceTimeline() {
  const [referenceDate, setReferenceDate] = useState<Date | null>(null);

  useEffect(() => {
    const updateReferenceDate = () => {
      const now = new Date();
      setReferenceDate((current) => current && current.getFullYear() === now.getFullYear() && current.getMonth() === now.getMonth() ? current : now);
    };
    updateReferenceDate();
    const timer = window.setInterval(updateReferenceDate, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="experience-timeline">
      <div className="experience-rail" aria-hidden="true" />
      {experiences.map((experience, index) => {
        const duration = calculateExperienceDuration(experience.startDate, experience.endDate, referenceDate);
        return (
          <article className={experience.current ? "is-current" : ""} key={`${experience.organization}-${experience.role}-${index}`}>
            <header className="experience-header">
              <div className="experience-identity"><span className="experience-index">EXP_{String(index + 1).padStart(2, "0")}</span><h3>{experience.organization}</h3></div>
              <div className="experience-period">
                <time>{experience.startDate} — {experience.endDate}</time>
                <span className="experience-duration">{duration ?? "Calculating..."}</span>
              </div>
            </header>
            <div className="experience-role"><strong>{experience.role}</strong></div>
            <p>{experience.description}</p>
            {experience.highlights.length > 0 && <ul>{experience.highlights.map((highlight) => <li key={highlight}><ExperienceHighlight highlight={highlight} /></li>)}</ul>}
          </article>
        );
      })}
    </div>
  );
}

export default function TerminalPortfolio() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [path, setPath] = useState(HOME);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [outputs, setOutputs] = useState<OutputItem[]>([
    { id: 0, content: <Welcome /> },
  ]);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [closing, setClosing] = useState(false);
  const [clock, setClock] = useState("");
  const [loginDate, setLoginDate] = useState("-- ---");
  const [mottoIndex, setMottoIndex] = useState(0);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now));
    };
    updateClock();
    setLoginDate(new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short" }).format(new Date()));
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const mottoTimer = window.setInterval(() => {
      setMottoIndex((current) => (current + 1) % HEADER_MOTTOS.length);
    }, 2600);
    return () => window.clearInterval(mottoTimer);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [outputs]);

  const addOutput = (command: string, content: ReactNode, commandPath = path, confirmation = false) => {
    setOutputs((current) => [...current, { id: nextId.current++, command, path: commandPath, confirmation, content }]);
  };

  const resolvePath = (target: string) => {
    if (!target || target === "~") return HOME;
    if (target === "/" || target === "/home") return target;
    const source = target.startsWith("~/") ? `${HOME}/${target.slice(2)}` : target.startsWith("/") ? target : `${path}/${target}`;
    const parts: string[] = [];
    source.split("/").forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") parts.pop();
      else parts.push(part);
    });
    return `/${parts.join("/")}`;
  };

  const directoryExists = (candidate: string) => getDirectoryEntries(candidate) !== null;

  const listDirectory = (targetPath: string): ReactNode => {
    const entries = getDirectoryEntries(targetPath);
    if (!entries) return null;
    if (targetPath === `${HOME}/blogs`) return <div className="ls-list">{blogs.map((blog) => <ClickableCommand key={blog.slug} command={`cat ${targetPath}/${blog.slug}.blog`}><span className="blog-file">{blog.slug}.blog</span><span className="file-meta">{blog.date} · {blog.title}</span></ClickableCommand>)}</div>;

    return <div className="ls-grid">{entries.map((entry) => {
      const absoluteEntryPath = `${targetPath === "/" ? "" : targetPath}/${entry.name}`;
      const isDirectory = entry.type === "directory";
      return <ClickableCommand key={entry.name} command={`${isDirectory ? "cd" : "cat"} ${absoluteEntryPath}`} className={isDirectory ? "dir" : ""}>{entry.name}{isDirectory ? "/" : ""}</ClickableCommand>;
    })}</div>;
  };

  const renderFile = (filename: string): ReactNode | null => {
    const cleanName = filename.split("/").pop() ?? filename;
    const lastSlashIndex = filename.lastIndexOf("/");
    const parentToken = lastSlashIndex === 0 ? "/" : filename.slice(0, lastSlashIndex);
    const effectivePath = lastSlashIndex >= 0 ? resolvePath(parentToken || ".") : path;

    if (effectivePath === "/" && cleanName in rootFiles) {
      const file = rootFiles[cleanName as keyof typeof rootFiles];
      return (
        <p className={`root-file ${cleanName === "angel.txt" ? "is-angel" : "is-devil"}`}>
          {file.content}
          {file.link && <a className="root-file-link" href={file.link.href} target="_blank" rel="noreferrer">{file.link.label}</a>}
        </p>
      );
    }

    if (cleanName === "profile.txt" && effectivePath === `${HOME}/information`) {
      return <div className="info-card"><p><span>name</span>{profile.name}</p><p><span>alias</span>{profile.alias}</p><p><span>role</span>{profile.role}</p><p><span>location</span>{profile.location}</p><p><span>workplace</span>{profile.workplace}</p><p><span>about</span>{profile.bio}</p></div>;
    }
    if (cleanName === "socials.txt" && effectivePath === `${HOME}/contact`) {
      return <div className="contact-list">{contacts.map((contact) => <a key={contact.label} href={contact.href} target="_blank" rel="noreferrer"><span>{contact.label.padEnd(10, " ")}</span>{contact.value}<b>↗</b></a>)}</div>;
    }
    if (cleanName === "pwned.txt" && effectivePath === `${HOME}/achievements`) {
      return <div className="achievement-list"><p className="output-heading">PWNED / LABS</p>{achievements.pwned.map((item, index) => <p key={item}><span>[{String(index + 1).padStart(2, "0")}]</span>{item}</p>)}</div>;
    }
    if (cleanName === "certifications.txt" && effectivePath === `${HOME}/achievements`) {
      return <div className="achievement-list"><p className="output-heading">CERTIFICATIONS</p>{achievements.certifications.map((item, index) => <p key={item}><span>[{String(index + 1).padStart(2, "0")}]</span>{item}</p>)}</div>;
    }
    if (cleanName === "journey.tree" && effectivePath === `${HOME}/path`) {
      return <div className="journey"><div className="journey-track" />{journey.map((milestone) => <article className={milestone.current ? "is-current" : ""} key={`${milestone.period}-${milestone.title}`}><time>{milestone.period}</time><h3>{milestone.title}</h3><p>{milestone.description}</p></article>)}</div>;
    }
    if (cleanName === "career.tree" && effectivePath === `${HOME}/experiences`) {
      return <ExperienceTimeline />;
    }
    if (cleanName.endsWith(".blog") && effectivePath === `${HOME}/blogs`) {
      const slug = cleanName.slice(0, -5);
      if (blogs.some((blog) => blog.slug === slug)) {
        router.push(`/blog/${slug}`);
        return <p className="success-message">Opening /blog/{slug}<span className="loading-dots">...</span></p>;
      }
    }
    return null;
  };

  const executeCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || closing) return;
    const commandPath = path;
    const [baseRaw, ...args] = trimmed.split(/\s+/);
    const base = baseRaw.toLowerCase();
    setHistory((current) => [...current, trimmed]);
    setHistoryIndex(-1);

    if (pendingNavigation) {
      const answer = trimmed.toLowerCase();
      if (answer === "y" || answer === "yes") {
        addOutput(trimmed, <p className="warning-resolution">Do not try to root me! Nothing for u</p>, commandPath, true);
        setPath(pendingNavigation.target);
        setPendingNavigation(null);
        return;
      }
      if (answer === "n" || answer === "no") {
        addOutput(trimmed, <p className="success-message">You made a wise choice!</p>, commandPath, true);
        setPendingNavigation(null);
        return;
      }
      addOutput(trimmed, <p className="warning-message">Please answer with <strong>y</strong> or <strong>n</strong>. <span>[y/n]</span></p>, commandPath, true);
      return;
    }

    if (base === "clear") {
      setOutputs([]);
      return;
    }
    if (base === "help" || base === "man") return addOutput(trimmed, <HelpOutput />, commandPath);
    if (base === "whoami") return addOutput(trimmed, <p><span className="accent">{profile.alias}&apos;s guest</span> — welcome, curious human.</p>, commandPath);
    if (base === "pwd") return addOutput(trimmed, <p>{path}</p>, commandPath);
    if (base === "date") return addOutput(trimmed, <p>{new Date().toString()}</p>, commandPath);
    if (base === "history") return addOutput(trimmed, <div className="history-output">{[...history, trimmed].map((item, index) => <p key={`${item}-${index}`}><span>{String(index + 1).padStart(3, " ")}</span>{item}</p>)}</div>, commandPath);
    if (base === "tree") return addOutput(trimmed, <TreeOutput />, commandPath);
    if (base === "ls") {
      const requested = args[0] ? resolvePath(args[0]) : path;
      if (!directoryExists(requested)) return addOutput(trimmed, <p className="error-message">ls: cannot access &apos;{args[0]}&apos;: No such file or directory</p>, commandPath);
      return addOutput(trimmed, listDirectory(requested), commandPath);
    }
    if (base === "cd") {
      const target = resolvePath(args[0] ?? "~");
      if (!directoryExists(target)) return addOutput(trimmed, <p className="error-message">cd: {args[0]}: No such file or directory</p>, commandPath);
      const isLeavingHome = (path === HOME || path.startsWith(`${HOME}/`)) && target !== HOME && !target.startsWith(`${HOME}/`);
      if (isLeavingHome) {
        addOutput(trimmed, null, commandPath);
        setPendingNavigation({ target });
        return;
      }
      addOutput(trimmed, null, commandPath);
      setPath(target);
      return;
    }
    if (base === "cat") {
      if (!args[0]) return addOutput(trimmed, <p className="error-message">cat: missing file operand</p>, commandPath);
      const content = renderFile(args[0]);
      if (!content) return addOutput(trimmed, <p className="error-message">cat: {args[0]}: No such file or directory</p>, commandPath);
      return addOutput(trimmed, content, commandPath);
    }
    if (base === "open") {
      if (!args[0]) return addOutput(trimmed, <p className="error-message">open: missing item operand</p>, commandPath);
      const contact = contacts.find((item) => item.label === args[0].toLowerCase());
      if (contact) {
        window.open(contact.href, "_blank", "noopener,noreferrer");
        return addOutput(trimmed, <p className="success-message">Opening {contact.label} ↗</p>, commandPath);
      }
      const slug = args[0].replace(/\.blog$/, "");
      if (blogs.some((blog) => blog.slug === slug)) {
        router.push(`/blog/${slug}`);
        return addOutput(trimmed, <p className="success-message">Opening /blog/{slug}<span className="loading-dots">...</span></p>, commandPath);
      }
      return addOutput(trimmed, <p className="error-message">open: {args[0]}: target not found</p>, commandPath);
    }
    if (base === "exit") {
      addOutput(trimmed, <div className="goodbye"><p>GOODBYE</p><span>Thanks for visiting my portfolio! Have a good day &lt;3</span></div>, commandPath);
      setClosing(true);
      window.setTimeout(() => window.location.reload(), 3200);
      return;
    }
    return addOutput(trimmed, <p className="error-message">bash: {baseRaw}: command not found <span>— type &apos;help&apos; for available commands</span></p>, commandPath);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const index = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(index);
      setInput(history[history.length - 1 - index] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex <= 0) { setHistoryIndex(-1); setInput(""); return; }
      const index = historyIndex - 1;
      setHistoryIndex(index);
      setInput(history[history.length - 1 - index] ?? "");
    } else if (event.key === "Tab") {
      event.preventDefault();
      const tokens = input.split(/\s+/);
      const activeToken = tokens.at(-1) ?? "";
      const tokenStart = input.length - activeToken.length;

      if (tokens.length === 1) {
        const matches = COMMANDS.filter((command) => command.startsWith(activeToken.toLowerCase()));
        const completion = matches.length === 1 ? matches[0] : longestCommonPrefix(matches);
        if (completion.length > activeToken.length) setInput(completion);
        return;
      }

      const slashIndex = activeToken.lastIndexOf("/");
      const typedDirectory = slashIndex >= 0 ? activeToken.slice(0, slashIndex + 1) : "";
      const fragment = activeToken.slice(slashIndex + 1);
      const parentToken = slashIndex < 0 ? "." : typedDirectory === "/" ? "/" : typedDirectory.slice(0, -1) || "/";
      const parentPath = resolvePath(parentToken);
      const baseCommand = tokens[0].toLowerCase();
      const entries = (getDirectoryEntries(parentPath) ?? []).filter((entry) => baseCommand !== "cd" || entry.type === "directory");
      const matches = entries.filter((entry) => entry.name.startsWith(fragment));
      if (!matches.length) return;

      let completedName = matches.length === 1 ? matches[0].name : longestCommonPrefix(matches.map((entry) => entry.name));
      if (matches.length === 1 && matches[0].type === "directory") completedName += "/";
      if (completedName.length <= fragment.length) return;
      setInput(`${input.slice(0, tokenStart)}${typedDirectory}${completedName}`);
    } else if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      setOutputs([]);
    }
  };

  const handleTerminalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-command]");
    if (target?.dataset.command) executeCommand(target.dataset.command);
    inputRef.current?.focus();
  };

  return (
    <main className="portfolio-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#terminal" aria-label={`${profile.alias} home`}><CloudLogo />{profile.alias}</a>
        <div className={`system-status ${mottoIndex === 1 ? "is-alternate" : ""}`} aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          <span className="status-message" key={HEADER_MOTTOS[mottoIndex]}>{HEADER_MOTTOS[mottoIndex]}</span>
        </div>
        <time>{clock} ICT</time>
      </header>

      <section id="terminal" className={`terminal-window ${minimized ? "is-minimized" : ""} ${maximized ? "is-maximized" : ""} ${closing ? "is-closing" : ""}`} aria-label="Interactive portfolio terminal">
        <div className="terminal-titlebar">
          <div className="window-controls" aria-label="Window controls">
            <button className="control close" aria-label="Exit terminal" title="Exit" onClick={() => executeCommand("exit")} />
            <button className="control minimize" aria-label={minimized ? "Restore terminal" : "Minimize terminal"} title="Minimize" onClick={() => setMinimized((value) => !value)} />
            <button className="control maximize" aria-label={maximized ? "Restore window" : "Maximize window"} title="Toggle size" onClick={() => { setMinimized(false); setMaximized((value) => !value); }} />
          </div>
          <div className="terminal-title"><span className="terminal-icon">▣</span> guest@{profile.alias}: {path === HOME ? "~" : path.replace(HOME, "~")}</div>
          <div className="titlebar-meta">zsh · 100×34</div>
        </div>

        {!minimized && <>
          <div className="terminal-body" ref={bodyRef} onClick={handleTerminalClick}>
            <div className="session-meta"><span>Last login: {loginDate}</span><span>session: web-visitor</span></div>
            <div className="terminal-output" aria-live="polite">
              {outputs.map((item) => (
                <div className="output-block" key={item.id}>
                  {item.command && <div className={`previous-command ${item.confirmation ? "is-confirmation" : ""}`}>{item.confirmation ? <ConfirmationPrompt /> : <Prompt path={item.path ?? HOME} />}<span>{item.command}</span></div>}
                  {item.content && <div className="command-result">{item.content}</div>}
                </div>
              ))}
            </div>
            {!closing && <form className={`command-line ${pendingNavigation ? "is-confirmation" : ""}`} onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="terminal-input">Enter a terminal command</label>
              {pendingNavigation ? <ConfirmationPrompt /> : <Prompt path={path} />}
              <input id="terminal-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} autoCapitalize="none" autoComplete="off" autoCorrect="off" spellCheck={false} autoFocus aria-label={pendingNavigation ? "Answer y or n" : "Enter a terminal command"} aria-describedby="terminal-instructions" />
            </form>}
            <p id="terminal-instructions" className="sr-only">Type help to see the list of available commands.</p>
          </div>
          <div className="terminal-statusbar"><span><b>●</b> NORMAL</span><span className="status-path">{path}</span><span>UTF-8</span><span>Ln {outputs.length + 1}, Col {input.length + 1}</span></div>
        </>}
      </section>

      <nav className="quick-commands" aria-label="Quick commands">
        <span>QUICK START</span>
        {["help", "ls", "whoami", "tree"].map((command) => <button key={command} type="button" disabled={Boolean(pendingNavigation)} onClick={() => executeCommand(command)}><i>$</i> {command}</button>)}
      </nav>

      <footer className="site-footer"><span>© {new Date().getFullYear()} {profile.alias.toUpperCase()}</span><span>ALWAYS LEARNING. ALWAYS EVOLVING.</span><span className="footer-flag" role="img" aria-label="Vietnam flag" title="Vietnam" /></footer>
    </main>
  );
}
