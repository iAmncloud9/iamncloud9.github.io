# iamncloud9 — Terminal Portfolio

An interactive Linux-terminal-inspired portfolio built with Next.js and TypeScript.

## Run locally

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then type `help`.

## Personalize the content

All placeholder profile data, contact links, achievements, and blog posts live in:

```text
src/data/portfolio.ts
```

Search for `[PLACEHOLDER]` and replace each value before publishing.

Quy trình chi tiết cho từng nhóm nội dung, template bài blog, cách thêm file và
checklist trước khi publish nằm tại [CONTENT_GUIDE.md](./CONTENT_GUIDE.md).

### Add files later

Register new static filenames in `portfolioFiles` inside `src/data/portfolio.ts`.
The `ls` output, `tree`, and path-aware `Tab` autocomplete all read from this
single registry. Blog filenames are generated automatically from the `blogs`
array, so a new blog entry is immediately available as `blogs/<slug>.blog`.

Autocomplete supports relative, parent, home, and absolute paths, for example:

```text
cat contact/soc<Tab>
cat ../contact/soc<Tab>
cat ~/contact/soc<Tab>
cat /home/iamncloud9/contact/soc<Tab>
```

## Commands

`help`, `whoami`, `pwd`, `ls`, `cd`, `cat`, `tree`, `open`, `history`, `date`, `clear`, and `exit`.

Keyboard shortcuts: `Tab` autocompletes, arrow keys navigate history, and `Ctrl+L` clears the terminal.

## Verify

```powershell
npm run typecheck
npm run build
```
