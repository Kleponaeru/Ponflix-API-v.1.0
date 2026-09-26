import CopyButton from "./ui/copy-button";

function toAnchorId(path: string) {
  return path.replaceAll("/", "-").replace(/\[|\]/g, "");
}

const endpoints = [
  {
    method: "GET",
    path: "/api/latest",
    title: "Latest anime",
    summary: "Latest anime cards from the provider.",
    params: [],
    request: `curl http://localhost:3000/api/latest`,
    response: {
      success: true,
      total: 2,
      data: [
        {
          slug: "solo-leveling-season-2",
          title: "Solo Leveling Season 2",
          path: "/anime/solo-leveling-season-2/",
          url: "https://kuronime.sbs/anime/solo-leveling-season-2/",
          thumbnail: "https://example.com/thumb.jpg",
          currentEpisode: 11,
          totalEpisodes: null,
          type: null,
          quality: null,
          hot: false,
          views: 123456,
          timeAgo: "2 hours ago",
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/search?q=solo...",
    title: "Search anime",
    summary: "Search anime by title or keyword.",
    params: [
      {
        name: "q",
        type: "string",
        required: true,
        description: "Search query.",
      },
    ],
    request: `curl "http://localhost:3000/api/search?q=solo..."`,
    response: {
      success: true,
      query: "solo",
      total: 1,
      data: [
        {
          slug: "solo-leveling-season-2",
          title: "Solo Leveling Season 2",
          path: "/anime/solo-leveling-season-2/",
          url: "https://kuronime.sbs/anime/solo-leveling-season-2/",
          thumbnail: "https://example.com/thumb.jpg",
          type: "TV",
          score: 8.7,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/anime/[slug]",
    title: "Anime details",
    summary: "Metadata for a single anime page.",
    params: [
      {
        name: "slug",
        type: "string",
        required: true,
        description: "Anime slug.",
      },
    ],
    request: `curl http://localhost:3000/api/anime/solo-leveling-season-2`,
    response: {
      success: true,
      slug: "solo-leveling-season-2",
      data: {
        slug: "solo-leveling-season-2",
        title: "Solo Leveling Season 2",
        path: "/anime/solo-leveling-season-2/",
        url: "https://kuronime.sbs/anime/solo-leveling-season-2/",
        thumbnail: "https://example.com/thumb.jpg",
        japaneseTitle: "Ore dake Level Up na Ken Season 2",
        synopsis: "Action fantasy anime summary.",
        score: 8.9,
        status: "Ongoing",
        aired: "2026",
        type: "TV",
        duration: "24 min",
        totalEpisodes: 12,
        genres: ["Action", "Fantasy"],
        views: 999999,
        updatedAt: "Updated 2 days ago",
      },
    },
  },
  {
    method: "GET",
    path: "/api/anime/[slug]/episodes",
    title: "Episode list",
    summary: "Episode links for a given anime.",
    params: [
      {
        name: "slug",
        type: "string",
        required: true,
        description: "Anime slug.",
      },
    ],
    request: `curl http://localhost:3000/api/anime/solo-leveling-season-2/episodes`,
    response: {
      success: true,
      data: [
        {
          title: "Episode 11",
          slug: "nonton-solo-leveling-episode-11",
          url: "https://kuronime.sbs/nonton-solo-leveling-episode-11/",
          path: "/nonton-solo-leveling-episode-11/",
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/episode/[id]",
    title: "Episode playback",
    summary: "Playable stream URLs and episode player metadata.",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Episode slug.",
      },
    ],
    request: `curl http://localhost:3000/api/episode/nonton-solo-leveling-episode-11`,
    response: {
      success: true,
      id: "nonton-solo-leveling-episode-11",
      data: {
        title: "Nonton Solo Leveling Episode 11 Subtitle Indonesia",
        iframe: "https://player.animeku.org/?data=...",
        sourceId: "dXl1RHBYeXlpcW1GWEMzb29Fb3ZCSWZsUU...",
        xenHash: "awar",
        servers: [
          {
            name: "BLOG PLAYER",
            value: "blog,default",
            quality: "BLOG",
            provider: "blog",
            url: "https://blog.animeku.org/player2.php?id=...",
          },
        ],
        download: null,
        filelions: null,
        blog: "Qnoralgrak4rZEVT...",
        raw: {
          status: 200,
          token: "2e91acd7a79cb51ad0d5cc3098393095",
          src: "eyJjdCI6Ik42R3B0TU94YXZq...",
          src_sd: "eyJjdCI6IlBTWUNsVExSUW...",
          mirror: "eyJjdCI6InVhTkxJQkpka0...",
        },
      },
    },
  },
] as const;

function CodeBlock({
  label,
  code,
  copyable = false,
}: {
  label: string;
  code: string;
  copyable?: boolean;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {label}
        </h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
            {label === "Request" ? "SHELL" : "JSON"}
          </span>
          {copyable ? <CopyButton text={code} /> : null}
        </div>
      </div>
      <pre className="max-w-full whitespace-pre-wrap break-words text-[13px] leading-6 text-slate-200">
        <code className="block max-w-full whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    </section>
  );
}

function EndpointCard({
  endpoint,
}: {
  endpoint: (typeof endpoints)[number];
}) {
  const response = JSON.stringify(endpoint.response, null, 2);

  return (
    <details
      id={toAnchorId(endpoint.path)}
      className="group scroll-mt-24 rounded-2xl border border-white/10 bg-slate-900/70"
    >
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 group-open:border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              {endpoint.method}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-xs text-slate-200 break-all">
              {endpoint.path}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300">
              {endpoint.params.length} params
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white">
                {endpoint.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                {endpoint.summary}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
              Click to {` `}
              <span className="group-open:hidden">expand</span>
              <span className="hidden group-open:inline">collapse</span>
            </span>
          </div>
        </div>
      </summary>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <div className="space-y-4">
            <CodeBlock label="Request" code={endpoint.request} copyable />
            <section className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Path params
              </h3>
              <div className="mt-3 space-y-2">
                {endpoint.params.length > 0 ? (
                  endpoint.params.map((param) => (
                    <div
                      key={param.name}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm text-white break-all">
                          {param.name}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                          {param.type}
                        </span>
                        <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-amber-200">
                          {param.required ? "required" : "optional"}
                        </span>
                      </div>
                      <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                        {param.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No parameters.</p>
                )}
              </div>
            </section>
          </div>

          <CodeBlock label="Response" code={response} />
        </div>
      </div>
    </details>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200/80">
            API Reference
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Ponflix API Docs
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Request and response examples for each public route.
          </p>
        </header>

        <section className="space-y-4">
          <details
            open
            className="rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg"
          >
            <summary className="cursor-pointer list-none px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                    Collection
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Kuronime
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-300">
                  {endpoints.length} routes
                </span>
              </div>
            </summary>

            <div className="border-t border-white/10 p-4 sm:p-5">
              <div className="grid gap-4">
                {endpoints.map((endpoint) => (
                  <EndpointCard key={endpoint.path} endpoint={endpoint} />
                ))}
              </div>
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
