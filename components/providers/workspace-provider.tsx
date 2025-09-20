"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type WorkspaceProject = {
  id: string;
  name: string;
  slug: string;
  region: string;
  status: "Active" | "In review" | "Paused";
  createdAt: string;
  description?: string;
};

type WorkspaceOrganization = {
  id: string;
  name: string;
  plan: "Starter" | "Pro" | "Enterprise";
  billingEmail: string;
  createdAt: string;
  projects: WorkspaceProject[];
};

type WorkspaceProjectInput = {
  name: string;
  slug: string;
  region: string;
  status?: WorkspaceProject["status"];
  description?: string;
};

type WorkspaceUpdate = Partial<Pick<WorkspaceOrganization, "name" | "billingEmail" | "plan" >>;

type WorkspaceContextValue = {
  organizations: WorkspaceOrganization[];
  organization: WorkspaceOrganization;
  project: WorkspaceProject;
  selectOrganization: (organizationId: string) => void;
  selectProject: (projectId: string) => void;
  addProject: (organizationId: string, project: WorkspaceProjectInput) => WorkspaceProject;
  updateOrganization: (organizationId: string, updates: WorkspaceUpdate) => void;
  updateProject: (organizationId: string, projectId: string, updates: Partial<Omit<WorkspaceProject, "id" | "createdAt">>) => void;
};

const STORAGE_KEY = "atlas-workspace-state";

const defaultOrganizations: WorkspaceOrganization[] = [
  {
    id: "personal",
    name: "Personal",
    plan: "Starter",
    billingEmail: "demo@atlas.ai",
    createdAt: "2024-01-12T09:00:00.000Z",
    projects: [
      {
        id: "default",
        name: "Default Project",
        slug: "default-project",
        region: "iad1",
        status: "Active",
        createdAt: "2024-01-12T09:00:00.000Z",
        description: "Initial sandbox connected to the Atlas API with limited quotas.",
      },
      {
        id: "voice-prototype",
        name: "Voice Prototype",
        slug: "voice-prototype",
        region: "fra1",
        status: "In review",
        createdAt: "2024-05-21T14:24:00.000Z",
        description: "Testing streaming speech synthesis for concierge workflows.",
      },
    ],
  },
  {
    id: "atlas-labs",
    name: "Atlas Labs",
    plan: "Enterprise",
    billingEmail: "platform@atlas.ai",
    createdAt: "2023-09-05T12:00:00.000Z",
    projects: [
      {
        id: "support-assistant",
        name: "Customer Support Assistant",
        slug: "support-assistant",
        region: "iad1",
        status: "Active",
        createdAt: "2023-10-01T08:12:00.000Z",
        description: "Production deployment serving multi-lingual support flows.",
      },
      {
        id: "image-research",
        name: "Image Research",
        slug: "image-research",
        region: "sfo3",
        status: "Paused",
        createdAt: "2024-03-18T11:45:00.000Z",
        description: "Internal testing environment for diffusion fine-tuning.",
      },
    ],
  },
];

interface StoredState {
  organizationId: string;
  projectId: string;
  organizations: WorkspaceOrganization[];
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(() => ({
    organizationId: defaultOrganizations[0].id,
    projectId: defaultOrganizations[0].projects[0].id,
    organizations: defaultOrganizations,
  }));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const parsed = JSON.parse(storedValue) as Partial<StoredState>;
        if (parsed && Array.isArray(parsed.organizations) && parsed.organizations.length > 0) {
          setState({
            organizationId: parsed.organizationId ?? parsed.organizations[0].id,
            projectId:
              parsed.projectId ??
              parsed.organizations[0]?.projects[0]?.id ?? defaultOrganizations[0].projects[0].id,
            organizations: parsed.organizations,
          });
          setIsHydrated(true);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to load workspace state", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to persist workspace state", error);
    }
  }, [state, isHydrated]);

  const organization = useMemo(() => {
    return (
      state.organizations.find((item) => item.id === state.organizationId) ?? state.organizations[0]
    );
  }, [state.organizations, state.organizationId]);

  const project = useMemo(() => {
    const currentOrganization = organization ?? state.organizations[0];
    return (
      currentOrganization?.projects.find((item) => item.id === state.projectId) ??
      currentOrganization?.projects[0] ??
      state.organizations[0].projects[0]
    );
  }, [organization, state.organizations, state.projectId]);

  const selectOrganization = useCallback((organizationId: string) => {
    setState((previous) => {
      const nextOrganization =
        previous.organizations.find((item) => item.id === organizationId) ?? previous.organizations[0];
      const nextProject =
        nextOrganization.projects.find((item) => item.id === previous.projectId) ??
        nextOrganization.projects[0] ??
        previous.projectId
          ? previous.organizations
              .flatMap((org) => org.projects)
              .find((project) => project.id === previous.projectId) ?? nextOrganization.projects[0]
          : nextOrganization.projects[0];
      return {
        organizationId: nextOrganization.id,
        projectId: nextProject ? nextProject.id : nextOrganization.projects[0]?.id ?? previous.projectId,
        organizations: previous.organizations,
      };
    });
  }, []);

  const selectProject = useCallback((projectId: string) => {
    setState((previous) => {
      const currentOrganization =
        previous.organizations.find((org) => org.id === previous.organizationId) ?? previous.organizations[0];
      const projectExists = currentOrganization.projects.some((project) => project.id === projectId);
      return {
        ...previous,
        projectId: projectExists ? projectId : currentOrganization.projects[0]?.id ?? previous.projectId,
      };
    });
  }, []);

  const addProject = useCallback(
    (organizationId: string, projectInput: WorkspaceProjectInput): WorkspaceProject => {
      const newProject: WorkspaceProject = {
        id: generateId(),
        name: projectInput.name,
        slug: projectInput.slug,
        region: projectInput.region,
        status: projectInput.status ?? "Active",
        description: projectInput.description,
        createdAt: new Date().toISOString(),
      };

      setState((previous) => {
        const organizations = previous.organizations.map((org) => {
          if (org.id !== organizationId) return org;
          return {
            ...org,
            projects: [...org.projects, newProject],
          };
        });
        const isCurrentOrg = previous.organizationId === organizationId;
        return {
          organizationId: previous.organizationId,
          projectId: isCurrentOrg ? newProject.id : previous.projectId,
          organizations,
        };
      });

      return newProject;
    },
    [],
  );

  const updateOrganization = useCallback((organizationId: string, updates: WorkspaceUpdate) => {
    setState((previous) => ({
      ...previous,
      organizations: previous.organizations.map((org) =>
        org.id === organizationId
          ? {
              ...org,
              ...updates,
            }
          : org,
      ),
    }));
  }, []);

  const updateProject = useCallback(
    (
      organizationId: string,
      projectId: string,
      updates: Partial<Omit<WorkspaceProject, "id" | "createdAt">>,
    ) => {
      setState((previous) => ({
        ...previous,
        organizations: previous.organizations.map((org) => {
          if (org.id !== organizationId) return org;
          return {
            ...org,
            projects: org.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    ...updates,
                  }
                : project,
            ),
          };
        }),
      }));
    },
    [],
  );

  const value = useMemo<WorkspaceContextValue>(() => {
    return {
      organizations: state.organizations,
      organization,
      project,
      selectOrganization,
      selectProject,
      addProject,
      updateOrganization,
      updateProject,
    };
  }, [state.organizations, organization, project, selectOrganization, selectProject, addProject, updateOrganization, updateProject]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

