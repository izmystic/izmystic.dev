interface ModrinthUser {
  username: string;
}

interface ModrinthProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  project_type: string;
  status: string;
  downloads: number;
  followers: number;
  icon_url: string | null;
  loaders: string[];
  game_versions: string[];
  versions: string[];
  updated: string;
}

interface ModrinthVersion {
  version_number: string;
  date_published: string;
}

export default defineCachedEventHandler(
  async (event) => {
    const { modrinthUser } = useRuntimeConfig(event);
    // Modrinth asks API clients to identify themselves with a descriptive User-Agent
    const api = <T>(path: string) =>
      $fetch<T>(path, {
        baseURL: "https://api.modrinth.com/v2",
        headers: { "User-Agent": "izmystic/izmystic.dev (https://izmystic.dev)" },
      });

    const [user, allProjects] = await Promise.all([api<ModrinthUser>(`/user/${modrinthUser}`), api<ModrinthProject[]>(`/user/${modrinthUser}/projects`)]);
    const projects = allProjects.filter((project) => project.status === "approved").sort((a, b) => b.downloads - a.downloads);

    const latestVersions: (ModrinthVersion | null)[] = await Promise.all(
      projects.map((project) =>
        api<ModrinthVersion[]>(`/project/${project.id}/version?include_changelog=false`)
          .then((versions) => versions[0] ?? null)
          .catch(() => null),
      ),
    );

    return {
      username: user.username,
      url: `https://modrinth.com/user/${user.username}`,
      downloads: projects.reduce((sum, project) => sum + project.downloads, 0),
      followers: projects.reduce((sum, project) => sum + project.followers, 0),
      projects: projects.map((project, index) => ({
        title: project.title,
        url: `https://modrinth.com/${project.project_type}/${project.slug}`,
        description: project.description,
        type: project.project_type,
        icon: project.icon_url,
        downloads: project.downloads,
        followers: project.followers,
        loaders: project.loaders,
        gameVersion: project.game_versions.at(-1) ?? null,
        versionCount: project.versions.length,
        latestVersion: latestVersions[index]?.version_number ?? null,
        updated: latestVersions[index]?.date_published ?? project.updated,
      })),
    };
  },
  { name: "modrinth", maxAge: 60 * 60, swr: true },
);
