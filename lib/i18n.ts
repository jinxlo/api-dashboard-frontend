export type Locale = "es" | "en";

type Dictionary = Record<string, unknown>;

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    common: {
      appName: "Atlas Console",
      organizationPlan: "Plan",
      contactSales: "Contacta ventas",
      billingContact: "Contacto de facturación",
      loading: "Cargando…",
      noData: "Sin datos disponibles",
    },
    auth: {
      brand: "Proveedor de inferencia de confianza",
      title: "Inicia sesión",
      subtitle:
        "Gestiona credenciales, espacios de trabajo y modelos de Hugging Face y Together AI desde un único panel.",
      welcome: "Te damos la bienvenida",
      description: "Introduce tus credenciales para acceder al panel.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tú@empresa.com",
      passwordLabel: "Contraseña",
      submit: "Iniciar sesión",
      submitting: "Iniciando…",
      requestAccess: "Solicitar acceso",
      createPrompt: "¿No tienes una cuenta?",
      oauthDivider: "o continúa con",
      google: "Google",
      github: "GitHub",
      errors: {
        email: "Introduce un correo válido",
        password: "La contraseña debe tener al menos 8 caracteres",
        generic: "No se pudo iniciar sesión. Inténtalo nuevamente.",
      },
    },
    header: {
      console: "Consola Atlas",
      searchPlaceholder: "Busca en documentación, guías o estado…",
      status: "Estado",
      docs: "Documentación",
      support: "Soporte",
      signOut: "Cerrar sesión",
    },
    navigation: {
      sections: {
        overview: "Resumen",
        workspace: "Espacio de trabajo",
        build: "Construir",
        security: "Seguridad",
      },
      items: {
        dashboard: "Panel",
        workspace: "Espacio",
        projects: "Proyectos",
        playground: "Playground",
        docs: "Docs",
        keys: "Claves API",
        account: "Cuenta",
      },
      accessibility: {
        open: "Abrir navegación",
        close: "Cerrar navegación",
        dismiss: "Cerrar superposición",
      },
    },
    sidebar: {
      billingContact: "Contacto de facturación",
      needAccess: "¿Necesitas acceso a producción?",
      contactSales: "Contacta ventas",
    },
    pageHeader: {
      viewDocs: "Ver documentación",
    },
    dashboard: {
      title: "Panel",
      description: "Supervisa salud, consumo y cumplimiento de tu plataforma Atlas.",
      statusPill: "Sistemas nominales",
      statusPeriod: "Últimas 24h · iad1",
      compliance: "SOC2 Tipo II · HIPAA",
      statusHistory: "Historial de estado",
      filters: "Filtros",
      metrics: {
        requests: "Solicitudes (30d)",
        tokens: "Consumo de tokens",
        voice: "Minutos de voz",
        images: "Imágenes generadas",
      },
      metricsDelta: {
        requests: "+8.4%",
        tokens: "Límite 20M",
        voice: "+112 en vivo",
        images: "Reinicio en 6d",
      },
      httpTitle: "Códigos HTTP",
      httpDescription: "Volumen de las últimas 24 horas",
      openMetrics: "Abrir métricas",
      latencyTitle: "Latencia y disponibilidad",
      latencyDescription: "Streaming y peticiones estándar",
      p95: "Latencia P95",
      availability: "Disponibilidad",
      availabilityNote:
        "Atlas sondea todas las regiones cada 60 segundos. Configura alertas en las políticas de proyecto.",
      apiCredentialsTitle: "Credenciales API",
      apiCredentialsDescription: "Claves recientes y ámbitos asignados.",
      manageKeys: "Administrar claves",
      activityTitle: "Actividad reciente",
      activityDescription: "Eventos de auditoría.",
      emptyActivity: "No hay eventos recientes.",
      createKey: "Crear clave API",
      availableModelsTitle: "Modelos disponibles",
      availableModelsDescription:
        "Provisiona modelos de lenguaje, voz e imagen de Hugging Face y Together AI para cada entorno del proyecto.",
      integrationGuide: "Guía de integración",
      modelTable: {
        model: "Modelo",
        modality: "Modalidad",
        context: "Contexto",
        release: "Versión",
        tokensLabel: "tokens",
        unknown: "—",
      },
      activity: {
        entries: {
          voice: {
            title: "Prototipo de voz desplegado",
            description: "Streaming TTS disponible en fra1",
            time: "Hoy, 12:24",
          },
          key: {
            title: "Clave rotada",
            description: "Credencial de webhook de producción regenerada",
            time: "Ayer, 18:07",
          },
          policy: {
            title: "Política actualizada",
            description: "Límites del playground incrementados a 120 RPM",
            time: "16 Sep, 09:42",
          },
        },
      },
    },
    apiKeys: {
      heading: "Claves API",
      description: "Genera y administra credenciales para tus integraciones.",
      create: "Crear clave",
      filters: {
        all: "Todas",
        language: "Lenguaje",
        speech: "Voz",
        vision: "Visión",
      },
      loading: "Cargando claves…",
      activeWorkspace: "Espacio activo",
      table: {
        label: "Etiqueta",
        models: "Modelos",
        created: "Creada",
        actions: "Acciones",
        copy: "Copiar",
        revoke: "Revocar",
        empty: "Aún no hay claves",
      },
      errors: {
        load: "No se pudieron cargar las claves API",
        models: "No se pudieron cargar los modelos disponibles",
        revoke: "No se pudo revocar la clave",
        generate: "No se pudo generar la clave",
      },
      dialog: {
        title: "Crear nueva clave",
        description: "Restringe la clave a los modelos necesarios. Puedes rotarla en cualquier momento.",
        label: "Etiqueta",
        labelPlaceholder: "Webhook de producción",
        labelHelp: "Opcional. Solo visible en el panel.",
        modelAccess: "Acceso a modelos",
        cancel: "Cancelar",
        submit: "Crear clave",
        generating: "Creando…",
        error: "Selecciona al menos un modelo o deja la clave sin ámbito.",
      },
      generated: {
        title: "Nueva clave generada",
        description: "Guarda la clave ahora; no volverá a mostrarse completa.",
        copy: "Copiar clave",
        close: "Cerrar",
        scopes: "Ámbitos",
      },
      list: {
        unscoped: "Sin ámbito",
        summaryUnscoped: "Sin ámbito",
        summaryNone: "Sin claves",
        rotateNotice:
          "Rota con frecuencia las credenciales de producción. Revisa la lista de endurecimiento antes de desplegar.",
        checklist: "Lista de verificación",
      },
      page: {
        reminder:
          "Atlas solo muestra los secretos recién generados una vez. Guárdalos en tu gestor seguro y usa claves distintas para pruebas y producción.",
        automation:
          "¿Necesitas automatizar la rotación? Llama a los endpoints /api/keys desde tus canalizaciones de CI o tu proveedor de infraestructura.",
      },
    },
    theme: {
      light: "Claro",
      dark: "Oscuro",
      toggleLabel: "Cambiar tema",
    },
    locale: {
      toggleLabel: "Cambiar idioma",
      es: "Español",
      en: "Inglés",
    },
    projects: {
      title: "Proyectos",
      description: "Estructura tu uso de Atlas por proyecto para aislar credenciales, cuotas y auditorías.",
      policiesTitle: "Políticas del espacio",
      policiesDescription: "Controla cómo los nuevos proyectos heredan el acceso.",
      defaultAccessTitle: "Acceso predeterminado",
      defaultAccessBody: "Los proyectos nuevos comienzan con acceso de solo lectura al entorno de staging compartido.",
      lifecycleTitle: "Ciclo de vida",
      lifecycleBody:
        "Después de la revisión de seguridad, promociona los proyectos a producción para habilitar cuotas en vivo y creación de claves API.",
      table: {
        intro: "Los proyectos agrupan credenciales, consumo y auditoría para cada superficie.",
        name: "Nombre",
        region: "Región",
        status: "Estado",
        created: "Creado",
        actions: "Acciones",
        placeholder: "Añade una descripción breve",
        active: "Activo",
        setActive: "Activar",
      },
      status: {
        active: "Activo",
        review: "En revisión",
        paused: "Pausado",
      },
      dialog: {
        title: "Crear nuevo proyecto",
        body:
          "Los proyectos aíslan credenciales, cuotas y métricas. Puedes cambiar entre ellos cuando quieras.",
        name: "Nombre del proyecto",
        namePlaceholder: "Aplicación de producción",
        slug: "Slug",
        slugPlaceholder: "mi-aplicacion-produccion",
        region: "Región",
        descriptionLabel: "Descripción",
        descriptionPlaceholder: "¿Qué potencia este proyecto?",
        cancel: "Cancelar",
        submit: "Crear proyecto",
      },
      regions: {
        iad1: "iad1 · EE. UU. Este",
        sfo3: "sfo3 · EE. UU. Oeste",
        fra1: "fra1 · UE Central",
        sin1: "sin1 · AP Sudeste",
      },
    },
  },
  en: {
    common: {
      appName: "Atlas Console",
      organizationPlan: "Plan",
      contactSales: "Contact sales",
      billingContact: "Billing contact",
      loading: "Loading…",
      noData: "No data available",
    },
    auth: {
      brand: "Trusted inference provider",
      title: "Sign in",
      subtitle:
        "Manage credentials, workspaces, and Hugging Face + Together AI models from a unified console.",
      welcome: "Welcome back",
      description: "Use your credentials to access the console.",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      passwordLabel: "Password",
      submit: "Sign in",
      submitting: "Signing in…",
      requestAccess: "Request access",
      createPrompt: "Don’t have an account?",
      oauthDivider: "or continue with",
      google: "Google",
      github: "GitHub",
      errors: {
        email: "Enter a valid email",
        password: "Password must be at least 8 characters",
        generic: "We couldn’t sign you in. Please try again.",
      },
    },
    header: {
      console: "Atlas Console",
      searchPlaceholder: "Search docs, guides, or status…",
      status: "Status",
      docs: "Docs",
      support: "Support",
      signOut: "Sign out",
    },
    navigation: {
      sections: {
        overview: "Overview",
        workspace: "Workspace",
        build: "Build",
        security: "Security",
      },
      items: {
        dashboard: "Dashboard",
        workspace: "Workspace",
        projects: "Projects",
        playground: "Playground",
        docs: "Docs",
        keys: "API keys",
        account: "Account",
      },
      accessibility: {
        open: "Open navigation",
        close: "Close navigation",
        dismiss: "Dismiss navigation overlay",
      },
    },
    sidebar: {
      billingContact: "Billing contact",
      needAccess: "Need production access?",
      contactSales: "Contact sales",
    },
    pageHeader: {
      viewDocs: "View documentation",
    },
    dashboard: {
      title: "Dashboard",
      description: "Monitor platform health, usage, and compliance across Atlas.",
      statusPill: "Systems nominal",
      statusPeriod: "Last 24 hours · iad1",
      compliance: "SOC2 Type II · HIPAA",
      statusHistory: "View status history",
      filters: "Filters",
      metrics: {
        requests: "Requests (30d)",
        tokens: "Token consumption",
        voice: "Voice minutes",
        images: "Image renders",
      },
      metricsDelta: {
        requests: "+8.4%",
        tokens: "Cap 20M",
        voice: "+112 live",
        images: "Reset in 6d",
      },
      httpTitle: "HTTP status codes",
      httpDescription: "Volume over the past 24 hours",
      openMetrics: "Open metrics",
      latencyTitle: "Latency & availability",
      latencyDescription: "Streaming + standard requests",
      p95: "P95 latency",
      availability: "Availability",
      availabilityNote:
        "Atlas pings every deployed region every 60 seconds. Configure alerts in the project policies panel.",
      apiCredentialsTitle: "API credentials",
      apiCredentialsDescription: "Recent keys and scoped access.",
      manageKeys: "Manage keys",
      activityTitle: "Recent activity",
      activityDescription: "Audit-grade events.",
      emptyActivity: "No recent events.",
      createKey: "Create API key",
      availableModelsTitle: "Available models",
      availableModelsDescription:
        "Provision language, speech, and vision models from Hugging Face and Together AI for every project environment.",
      integrationGuide: "Integration guide",
      modelTable: {
        model: "Model",
        modality: "Modality",
        context: "Context",
        release: "Release",
        tokensLabel: "tokens",
        unknown: "—",
      },
      activity: {
        entries: {
          voice: {
            title: "Voice prototype deployed",
            description: "Streaming TTS live in fra1",
            time: "Today, 12:24",
          },
          key: {
            title: "Key rotated",
            description: "Production webhook credential regenerated",
            time: "Yesterday, 18:07",
          },
          policy: {
            title: "Policy updated",
            description: "Playground rate limits increased to 120 RPM",
            time: "Sep 16, 09:42",
          },
        },
      },
    },
    apiKeys: {
      heading: "API keys",
      description: "Generate and manage credentials for your integrations.",
      create: "Create key",
      filters: {
        all: "All",
        language: "Language",
        speech: "Speech",
        vision: "Vision",
      },
      loading: "Loading keys…",
      activeWorkspace: "Active workspace",
      table: {
        label: "Label",
        models: "Models",
        created: "Created",
        actions: "Actions",
        copy: "Copy",
        revoke: "Revoke",
        empty: "No keys yet",
      },
      errors: {
        load: "Unable to load API keys",
        models: "Unable to load models",
        revoke: "Unable to revoke key",
        generate: "Unable to generate key",
      },
      dialog: {
        title: "Create a new API key",
        description: "Scope the key to the models you need. Rotate or revoke at any time.",
        label: "Label",
        labelPlaceholder: "Production webhook",
        labelHelp: "Optional. Only visible in this dashboard.",
        modelAccess: "Model access",
        cancel: "Cancel",
        submit: "Create key",
        generating: "Creating…",
        error: "Select at least one model or leave the key unscoped.",
      },
      generated: {
        title: "New API key generated",
        description: "This is the only time the full key is shown. Store it securely.",
        copy: "Copy key",
        close: "Close",
        scopes: "Scopes",
      },
      list: {
        unscoped: "Unscoped",
        summaryUnscoped: "Unscoped",
        summaryNone: "No keys yet",
        rotateNotice:
          "Rotate production credentials regularly. Review the hardening checklist before shipping.",
        checklist: "Hardening checklist",
      },
      page: {
        reminder:
          "Atlas only surfaces new secrets once. Store them in your vault and keep separate keys for staging and production.",
        automation:
          "Need automated rotation? Call the /api/keys endpoints from your CI pipelines or infrastructure tooling.",
      },
    },
    theme: {
      light: "Light",
      dark: "Dark",
      toggleLabel: "Toggle theme",
    },
    locale: {
      toggleLabel: "Toggle language",
      es: "Spanish",
      en: "English",
    },
    projects: {
      title: "Projects",
      description: "Structure your Atlas usage by project to isolate credentials, quotas, and audit logs.",
      policiesTitle: "Workspace policies",
      policiesDescription: "Control how new projects inherit access.",
      defaultAccessTitle: "Default access",
      defaultAccessBody: "New projects start with read-only access to the shared staging environment.",
      lifecycleTitle: "Lifecycle",
      lifecycleBody:
        "After security review, promote projects to production to unlock live quotas and API key creation.",
      table: {
        intro: "Projects group credentials, usage, and auditing for a specific surface area.",
        name: "Name",
        region: "Region",
        status: "Status",
        created: "Created",
        actions: "Actions",
        placeholder: "Add a short description",
        active: "Active",
        setActive: "Set active",
      },
      status: {
        active: "Active",
        review: "In review",
        paused: "Paused",
      },
      dialog: {
        title: "Create a new project",
        body: "Projects isolate API credentials, quotas, and metrics. You can switch between them at any time.",
        name: "Project name",
        namePlaceholder: "My production app",
        slug: "Slug",
        slugPlaceholder: "my-production-app",
        region: "Region",
        descriptionLabel: "Description",
        descriptionPlaceholder: "What does this project power?",
        cancel: "Cancel",
        submit: "Create project",
      },
      regions: {
        iad1: "iad1 · US East",
        sfo3: "sfo3 · US West",
        fra1: "fra1 · EU Central",
        sin1: "sin1 · AP Southeast",
      },
    },
  },
};

export function translate(dictionary: Dictionary, key: string): string {
  if (!key) return key;
  const path = key.split(".");
  let value: unknown = dictionary;
  for (const segment of path) {
    if (value && typeof value === "object" && segment in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[segment];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "es" || value === "en";
}

