export const permissions = {
  tools: {
    read: "tools.read",
    create: "tools.create",
    update: "tools.update",
    publish: "tools.publish",
  },

  content: {
    read: "content.read",
    create: "content.create",
    update: "content.update",
    publish: "content.publish",
  },

  users: {
    read: "users.read",
    manage: "users.manage",
  },

  seo: {
    read: "seo.read",
    manage: "seo.manage",
  },

  analytics: {
    read: "analytics.read",
  },

  billing: {
    read: "billing.read",
    manage: "billing.manage",
  },

  organizations: {
    read: "organizations.read",
    manage: "organizations.manage",
  },

  system: {
    read: "system.read",
    manage: "system.manage",
  },
} as const;

export type PermissionKey =
  | typeof permissions.tools[
      keyof typeof permissions.tools
    ]
  | typeof permissions.content[
      keyof typeof permissions.content
    ]
  | typeof permissions.users[
      keyof typeof permissions.users
    ]
  | typeof permissions.seo[
      keyof typeof permissions.seo
    ]
  | typeof permissions.analytics[
      keyof typeof permissions.analytics
    ]
  | typeof permissions.billing[
      keyof typeof permissions.billing
    ]
  | typeof permissions.organizations[
      keyof typeof permissions.organizations
    ]
  | typeof permissions.system[
      keyof typeof permissions.system
    ];