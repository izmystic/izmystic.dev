interface GitHubUser {
  login: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  pushed_at: string;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { action?: string; ref?: string | null; ref_type?: string };
}

const EVENT_LABELS: Record<string, string> = {
  PushEvent: "push",
  CreateEvent: "create",
  DeleteEvent: "delete",
  ForkEvent: "fork",
  WatchEvent: "star",
  IssuesEvent: "issue",
  IssueCommentEvent: "comment",
  PullRequestEvent: "pr",
  PullRequestReviewEvent: "review",
  ReleaseEvent: "release",
  PublicEvent: "publish",
};

function describeEvent(event: GitHubEvent) {
  const { payload } = event;
  if (event.type === "PushEvent") return payload.ref?.replace("refs/heads/", "") ?? "";
  if (event.type === "CreateEvent" || event.type === "DeleteEvent") return [payload.ref_type, payload.ref].filter(Boolean).join(" ");
  if (event.type === "WatchEvent" || event.type === "ForkEvent") return "";
  return payload.action ?? "";
}

export default defineCachedEventHandler(
  async () => {
    const { githubUser, githubToken } = useRuntimeConfig();
    const headers = {
      Accept: "application/vnd.github+json",
      // GitHub rejects requests without a User-Agent, and Cloudflare's fetch doesn't send one by default
      "User-Agent": "izmystic/izmystic.dev (https://izmystic.dev)",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    };
    const api = <T>(path: string) => $fetch<T>(path, { baseURL: "https://api.github.com", headers });

    const [user, repos, events] = await Promise.all([
      api<GitHubUser>(`/users/${githubUser}`),
      api<GitHubRepo[]>(`/users/${githubUser}/repos?per_page=100&sort=pushed`),
      api<GitHubEvent[]>(`/users/${githubUser}/events/public?per_page=50`),
    ]);

    const own = repos.filter((repo) => !repo.fork);

    const languageCounts = new Map<string, number>();
    for (const repo of own) {
      if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }

    // The events feed isn't strictly chronological
    const activity: { type: string; repo: string; detail: string; date: string; count: number }[] = [];
    for (const event of events.toSorted((a, b) => b.created_at.localeCompare(a.created_at))) {
      const entry = {
        type: EVENT_LABELS[event.type] ?? event.type.replace(/Event$/, "").toLowerCase(),
        repo: event.repo.name,
        detail: describeEvent(event),
        date: event.created_at,
        count: 1,
      };
      const last = activity.at(-1);
      if (last && last.type === entry.type && last.repo === entry.repo && last.detail === entry.detail) last.count++;
      else activity.push(entry);
    }

    return {
      login: user.login,
      url: user.html_url,
      repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      stars: own.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      joined: user.created_at,
      languages: [...languageCounts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      recentRepos: own.slice(0, 6).map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        pushed: repo.pushed_at,
      })),
      activity: activity.slice(0, 8),
    };
  },
  { name: "github", maxAge: 60 * 60, swr: true },
);
