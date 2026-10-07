import { relations } from "drizzle-orm";

import {
  calculatorDatasets,
  datasets,
  datasetVersions,
  formulaVersions,
} from "./calculator-engine";

import {
  organizationMemberships,
  organizations,
} from "./organizations";

import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "./rbac";

import {
  calculatorVersionSources,
  sources,
  toolSources,
} from "./sources";

import {
  calculatorVersions,
  toolCategories,
  tools,
} from "./tools";

import {
  accounts,
  sessions,
} from "./auth";

import {
  emailVerificationTokens,
  passwordResetTokens,
} from "./security-tokens";

import { users } from "./users";

export const usersRelations = relations(
  users,
  ({ many }) => ({
    accounts: many(accounts),

    sessions: many(sessions),

    emailVerificationTokens: many(
      emailVerificationTokens,
    ),

    passwordResetTokens: many(
      passwordResetTokens,
    ),

    organizationMemberships: many(
      organizationMemberships,
    ),

    userRoles: many(userRoles),
  }),
);

export const accountsRelations =
  relations(
    accounts,
    ({ one }) => ({
      user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
      }),
    }),
  );

export const sessionsRelations =
  relations(
    sessions,
    ({ one }) => ({
      user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
      }),
    }),
  );

export const emailVerificationTokensRelations =
  relations(
    emailVerificationTokens,
    ({ one }) => ({
      user: one(users, {
        fields: [
          emailVerificationTokens.userId,
        ],
        references: [users.id],
      }),
    }),
  );

export const passwordResetTokensRelations =
  relations(
    passwordResetTokens,
    ({ one }) => ({
      user: one(users, {
        fields: [
          passwordResetTokens.userId,
        ],
        references: [users.id],
      }),
    }),
  );

export const organizationsRelations =
  relations(
    organizations,
    ({ many }) => ({
      memberships: many(
        organizationMemberships,
      ),
    }),
  );

export const organizationMembershipsRelations =
  relations(
    organizationMemberships,
    ({ one }) => ({
      organization: one(organizations, {
        fields: [
          organizationMemberships.organizationId,
        ],
        references: [organizations.id],
      }),

      user: one(users, {
        fields: [
          organizationMemberships.userId,
        ],
        references: [users.id],
      }),
    }),
  );

export const rolesRelations = relations(
  roles,
  ({ many }) => ({
    permissions: many(rolePermissions),
    users: many(userRoles),
  }),
);

export const permissionsRelations =
  relations(
    permissions,
    ({ many }) => ({
      roles: many(rolePermissions),
    }),
  );

export const rolePermissionsRelations =
  relations(
    rolePermissions,
    ({ one }) => ({
      role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
      }),

      permission: one(permissions, {
        fields: [
          rolePermissions.permissionId,
        ],
        references: [permissions.id],
      }),
    }),
  );

export const userRolesRelations = relations(
  userRoles,
  ({ one }) => ({
    user: one(users, {
      fields: [userRoles.userId],
      references: [users.id],
    }),

    role: one(roles, {
      fields: [userRoles.roleId],
      references: [roles.id],
    }),
  }),
);

export const toolCategoriesRelations =
  relations(
    toolCategories,
    ({ many }) => ({
      tools: many(tools),
    }),
  );

export const toolsRelations = relations(
  tools,
  ({ one, many }) => ({
    category: one(toolCategories, {
      fields: [tools.categoryId],
      references: [toolCategories.id],
    }),

    versions: many(calculatorVersions),
    sources: many(toolSources),
  }),
);

export const calculatorVersionsRelations =
  relations(
    calculatorVersions,
    ({ one, many }) => ({
      tool: one(tools, {
        fields: [
          calculatorVersions.toolId,
        ],
        references: [tools.id],
      }),

      formulas: many(formulaVersions),

      datasets: many(calculatorDatasets),

      sources: many(
        calculatorVersionSources,
      ),
    }),
  );

export const formulaVersionsRelations =
  relations(
    formulaVersions,
    ({ one }) => ({
      calculatorVersion: one(
        calculatorVersions,
        {
          fields: [
            formulaVersions
              .calculatorVersionId,
          ],
          references: [
            calculatorVersions.id,
          ],
        },
      ),
    }),
  );

export const datasetsRelations = relations(
  datasets,
  ({ many }) => ({
    versions: many(datasetVersions),
  }),
);

export const datasetVersionsRelations =
  relations(
    datasetVersions,
    ({ one, many }) => ({
      dataset: one(datasets, {
        fields: [
          datasetVersions.datasetId,
        ],
        references: [datasets.id],
      }),

      calculators: many(
        calculatorDatasets,
      ),
    }),
  );

export const calculatorDatasetsRelations =
  relations(
    calculatorDatasets,
    ({ one }) => ({
      calculatorVersion: one(
        calculatorVersions,
        {
          fields: [
            calculatorDatasets
              .calculatorVersionId,
          ],
          references: [
            calculatorVersions.id,
          ],
        },
      ),

      datasetVersion: one(
        datasetVersions,
        {
          fields: [
            calculatorDatasets
              .datasetVersionId,
          ],
          references: [
            datasetVersions.id,
          ],
        },
      ),
    }),
  );

export const sourcesRelations = relations(
  sources,
  ({ many }) => ({
    tools: many(toolSources),

    calculatorVersions: many(
      calculatorVersionSources,
    ),
  }),
);

export const toolSourcesRelations =
  relations(
    toolSources,
    ({ one }) => ({
      tool: one(tools, {
        fields: [toolSources.toolId],
        references: [tools.id],
      }),

      source: one(sources, {
        fields: [toolSources.sourceId],
        references: [sources.id],
      }),
    }),
  );

export const calculatorVersionSourcesRelations =
  relations(
    calculatorVersionSources,
    ({ one }) => ({
      calculatorVersion: one(
        calculatorVersions,
        {
          fields: [
            calculatorVersionSources
              .calculatorVersionId,
          ],
          references: [
            calculatorVersions.id,
          ],
        },
      ),

      source: one(sources, {
        fields: [
          calculatorVersionSources.sourceId,
        ],
        references: [sources.id],
      }),
    }),
  );