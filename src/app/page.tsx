import CopyButton from "./ui/copy-button";

function toAnchorId(path: string) {
  return path.replaceAll("/", "-").replace(/\[|\]/g, "");
}

type Endpoint = {
  method: string;
  path: string;
  title: string;
  summary: string;
  params: readonly {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  request: string;
  response: unknown;
};

const aniwatchEndpoints = [
  {
    method: "GET",
    path: "/api/spotlight",
    title: "AniWatch spotlight",
    summary: "Spotlight anime cards scraped from AniWatch.",
    params: [],
    request: `curl http://localhost:3000/api/spotlight`,
    response: {
      success: true,
      total: 6,
      data: [
        {
          slug: "fire-force-season-3-part-2",
          title: "Fire Force Season 3 Part 2",
          path: "/anime/fire-force-season-3-part-2/",
          url: "https://aniwatchtv.ro/anime/fire-force-season-3-part-2/",
          thumbnail: "https://i0.wp.com/aniwatchtv.ro/wp-content/uploads/2026/08/Fire-Force-Season-3.webp",
          currentEpisode: 13,
          totalEpisodes: null,
          type: "TV",
          quality: "HD",
          hot: false,
          views: null,
          timeAgo: null,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/trending",
    title: "AniWatch trending",
    summary: "AniWatch's current trending anime rankings.",
    params: [],
    request: `curl http://localhost:3000/api/trending`,
    response: {
      success: true,
      total: 12,
      data: [
        {
          slug: "one-piece",
          title: "One Piece",
          path: "/anime/one-piece/",
          url: "https://aniwatchtv.ro/anime/one-piece/",
          thumbnail: "https://i0.wp.com/aniwatchtv.ro/wp-content/uploads/2026/08/One-Piece.jpg",
          rank: 1,
        },
        {
          slug: "mushoku-tensei-jobless-reincarnation-season-3",
          title: "Mushoku Tensei: Jobless Reincarnation Season 3",
          path: "/anime/mushoku-tensei-jobless-reincarnation-season-3/",
          url: "https://aniwatchtv.ro/anime/mushoku-tensei-jobless-reincarnation-season-3/",
          thumbnail: "https://i0.wp.com/aniwatchtv.ro/wp-content/uploads/2026/08/611a1a4eb05e5e111d7e0ff2f7d7b3cd.png",
          rank: 2,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/latest",
    title: "Latest completed anime",
    summary: "Recently completed anime from AniWatch.",
    params: [],
    request: `curl http://localhost:3000/api/latest`,
    response: {
      success: true,
      total: 5,
      data: [
        {
          slug: "trapped-in-a-dating-sim-the-world-of-otome-games-is-tough-for-mobs",
          title: "Trapped in a Dating Sim: The World of Otome Games is Tough for Mobs",
          path: "/anime/trapped-in-a-dating-sim-the-world-of-otome-games-is-tough-for-mobs/",
          url: "https://aniwatchtv.ro/anime/trapped-in-a-dating-sim-the-world-of-otome-games-is-tough-for-mobs/",
          thumbnail: "https://i0.wp.com/aniwatchtv.ro/wp-content/uploads/2026/09/Trapped-in-a-Dating-Sim-The-World-of-Otome-Games-is-Tough-for-Mobs-212x300.jpg",
          currentEpisode: 12,
          totalEpisodes: 12,
          type: "TV",
          quality: null,
          hot: false,
          views: null,
          timeAgo: null,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/search?q=naruto",
    title: "Search AniWatch",
    summary: "Search AniWatch anime by title or keyword.",
    params: [
      {
        name: "q",
        type: "string",
        required: true,
        description: "Search query.",
      },
    ],
    request: `curl "http://localhost:3000/api/search?q=naruto"`,
    response: {
      success: true,
      query: "naruto",
      total: 24,
      data: [
        {
          slug: "boruto-naruto-next-generations",
          title: "Boruto: Naruto Next Generations",
          path: "/anime/boruto-naruto-next-generations/",
          url: "https://aniwatchtv.ro/anime/boruto-naruto-next-generations/",
          thumbnail: "https://i0.wp.com/aniwatchtv.ro/wp-content/uploads/2026/08/Boruto-Naruto-Next-Generations-212x300.jpg",
          type: "TV",
          score: null,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/anime/[slug]",
    title: "AniWatch anime details",
    summary: "Metadata for an AniWatch anime page.",
    params: [
      {
        name: "slug",
        type: "string",
        required: true,
        description: "AniWatch anime slug, such as boruto-naruto-next-generations.",
      },
    ],
    request: `curl http://localhost:3000/api/anime/boruto-naruto-next-generations`,
    response: {
      success: true,
      slug: "boruto-naruto-next-generations",
      data: {
        slug: "boruto-naruto-next-generations",
        title: "Boruto: Naruto Next Generations",
        path: "/anime/boruto-naruto-next-generations/",
        url: "https://aniwatchtv.ro/anime/boruto-naruto-next-generations/",
        japaneseTitle: "Boruto: Naruto Next Generations",
        synopsis: "Following the successful end of the Fourth Shinobi World War...",
        score: 6.6,
        status: "Finished Airing",
        aired: "Apr 5, 2017 to Mar 26, 2023",
        type: "TV",
        duration: "23m min",
        totalEpisodes: 293,
        genres: ["Action", "Adventure", "Martial Arts", "Shounen", "Super Power"],
        views: null,
        updatedAt: "2026-09-25T02:42:38+00:00",
      },
    },
  },
  {
    method: "GET",
    path: "/api/anime/[slug]/episodes",
    title: "AniWatch episode list",
    summary: "Episode links loaded from AniWatch.",
    params: [
      {
        name: "slug",
        type: "string",
        required: true,
        description: "AniWatch anime slug.",
      },
    ],
    request: `curl http://localhost:3000/api/anime/boruto-naruto-next-generations/episodes`,
    response: {
      success: true,
      data: [
        {
          title: "Episode 1",
          slug: "boruto-naruto-next-generations-episode-1",
          path: "/boruto-naruto-next-generations-episode-1/",
          url: "https://aniwatchtv.ro/boruto-naruto-next-generations-episode-1/",
          number: 1,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/episode/[id]",
    title: "AniWatch episode playback",
    summary: "Iframe and decoded playback servers for an AniWatch episode.",
    params: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Episode slug, such as boruto-naruto-next-generations-episode-293.",
      },
    ],
    request: `curl http://localhost:3000/api/episode/boruto-naruto-next-generations-episode-293`,
    response: {
      success: true,
      id: "boruto-naruto-next-generations-episode-293",
      data: {
        title: "Boruto: Naruto Next Generations Episode 293",
        iframe: "https://zokoanime.video/stream/mal/34566/293/sub",
        sourceId: "13677",
        servers: [
          {
            name: "Fast Player",
            value: "sub,fast-player",
            quality: "Fast Player",
            provider: "fast-player",
            url: "https://zokoanime.video/stream/mal/34566/293/sub",
          },
        ],
        sourceStatus: "ok",
        playbackAvailable: true,
      },
    },
  },
] satisfies readonly Endpoint[];

const tmdbEndpoints = [
  {
    method: "GET",
    path: "/api/tmdb/search?query=spider-man&page=1&language=en-US",
    title: "Search TMDB movies",
    summary: "Search TMDB's movie catalog and return paginated results.",
    params: [
      {
        name: "query",
        type: "string",
        required: true,
        description: "Movie title or keyword to search for.",
      },
      {
        name: "page",
        type: "number",
        required: false,
        description: "Result page, starting at 1.",
      },
      {
        name: "language",
        type: "string",
        required: false,
        description: "TMDB language tag, such as en-US or id-ID.",
      },
    ],
    request: `curl "http://localhost:3000/api/tmdb/search?query=spider-man&page=1&language=en-US"`,
    response: {
      success: true,
      query: "spider-man",
      page: 1,
      totalPages: 42,
      total: 821,
      data: [
        {
          id: 557,
          title: "Spider-Man",
          original_title: "Spider-Man",
          release_date: "2002-05-01",
          poster_path: "/...jpg",
          vote_average: 7.3,
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/api/tmdb/movie/[id]?append_to_response=videos,images",
    title: "TMDB movie details",
    summary: "Fetch a movie and optionally append related TMDB subrequests in one call.",
    params: [
      {
        name: "id",
        type: "number",
        required: true,
        description: "TMDB movie ID, such as 557.",
      },
      {
        name: "append_to_response",
        type: "string",
        required: false,
        description: "Comma-separated movie subresources, such as videos,images.",
      },
      {
        name: "language",
        type: "string",
        required: false,
        description: "TMDB language tag for the movie and appended resources.",
      },
      {
        name: "include_image_language",
        type: "string",
        required: false,
        description: "Language filter for appended images, such as en,null.",
      },
    ],
    request: `curl "http://localhost:3000/api/tmdb/movie/557?append_to_response=videos,images&include_image_language=en,null"`,
    response: {
      success: true,
      data: {
        id: 557,
        title: "Spider-Man",
        overview: "After being bitten by a genetically altered spider...",
        release_date: "2002-05-01",
        videos: { results: [{ key: "...", site: "YouTube", type: "Trailer" }] },
        images: { backdrops: [], posters: [] },
      },
    },
  },
  {
    method: "GET",
    path: "/api/tmdb/v3/discover/movie?with_genres=28&sort_by=popularity.desc&page=1",
    title: "Discover TMDB movies",
    summary: "Browse and filter TMDB movies. TMDB discovery filters are passed through.",
    params: [
      {
        name: "with_genres",
        type: "string",
        required: false,
        description: "Genre IDs to include, such as 28 for Action.",
      },
      {
        name: "sort_by",
        type: "string",
        required: false,
        description: "TMDB sort order, such as popularity.desc or vote_average.desc.",
      },
      {
        name: "page",
        type: "number",
        required: false,
        description: "Result page, starting at 1.",
      },
    ],
    request: `curl "http://localhost:3000/api/tmdb/v3/discover/movie?with_genres=28&sort_by=popularity.desc&page=1"`,
    response: {
      page: 1,
      results: [
        {
          id: 550,
          title: "Example Movie",
          genre_ids: [28],
          release_date: "2025-01-01",
          poster_path: "/example.jpg",
          vote_average: 7.5,
        },
      ],
      total_pages: 20,
      total_results: 400,
    },
  },
  {
    method: "GET",
    path: "/api/tmdb/v3/trending/movie/week",
    title: "TMDB trending movies",
    summary: "Get movies trending today or this week.",
    params: [],
    request: `curl http://localhost:3000/api/tmdb/v3/trending/movie/week`,
    response: {
      page: 1,
      results: [
        {
          id: 550,
          title: "Example Movie",
          media_type: "movie",
          release_date: "2025-01-01",
          poster_path: "/example.jpg",
        },
      ],
      total_pages: 10,
      total_results: 200,
    },
  },
  {
    method: "GET",
    path: "/api/tmdb/v3/movie/[id]/watch/providers",
    title: "Movie streaming availability",
    summary: "List where TMDB reports a movie is available to stream, rent, or buy.",
    params: [
      {
        name: "id",
        type: "number",
        required: true,
        description: "TMDB movie ID.",
      },
    ],
    request: `curl http://localhost:3000/api/tmdb/v3/movie/550/watch/providers`,
    response: {
      id: 550,
      results: {
        US: {
          link: "https://www.themoviedb.org/movie/550/watch",
          flatrate: [{ provider_name: "Example Streaming Service" }],
        },
      },
    },
  },
] satisfies readonly Endpoint[];

function CodeBlock({
  label,
  code,
  copyable = false,
}: {
  label: string;
  code: string;
  copyable?: boolean;
}) {
  const copyText = code
    .replace(/^curl\s+/, "")
    .replace(/^"(.*)"$/, "$1")
    .replace(/^https?:\/\/[^/]+/, "");

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
          {copyable ? <CopyButton text={copyText} /> : null}
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
  provider,
}: {
  endpoint: Endpoint;
  provider: string;
}) {
  const response = JSON.stringify(endpoint.response, null, 2) ?? "";

  return (
    <details
      id={toAnchorId(`${provider}-${endpoint.path}`)}
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

function EndpointCollection({
  label,
  name,
  provider,
  endpoints,
  open = false,
}: {
  label: string;
  name: string;
  provider: string;
  endpoints: readonly Endpoint[];
  open?: boolean;
}) {
  return (
    <details
      open={open}
      className="rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg"
    >
      <summary className="cursor-pointer list-none px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              {label}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">{name}</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-300">
            {endpoints.length} routes
          </span>
        </div>
      </summary>

      <div className="border-t border-white/10 p-4 sm:p-5">
        <div className="grid gap-4">
          {endpoints.map((endpoint) => (
            <EndpointCard
              key={`${provider}-${endpoint.path}`}
              endpoint={endpoint}
              provider={provider}
            />
          ))}
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
          <EndpointCollection
            label="Primary provider"
            name="AniWatch"
            provider="aniwatch"
            endpoints={aniwatchEndpoints}
            open
          />
          <EndpointCollection
            label="Movie metadata"
            name="TMDB"
            provider="tmdb"
            endpoints={tmdbEndpoints}
          />
        </section>
      </div>
    </main>
  );
}
