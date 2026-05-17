export type NotificationSeverity = "success" | "error" | "info" | "warning";

export type NotificationMessage = {
  message: string;
  severity: NotificationSeverity;
};

type NotificationValue = string | number;

type NotificationDefinition =
  | NotificationMessage
  | ((values?: Record<string, NotificationValue>) => NotificationMessage);

export type NotificationKey =
  | "comments.create.error"
  | "comments.create.success"
  | "comments.delete.error"
  | "comments.delete.success"
  | "comments.load.error"
  | "comments.required.error"
  | "issues.create.success"
  | "issues.create.error"
  | "issues.delete.error"
  | "issues.delete.success"
  | "issues.detail.load.error"
  | "issues.load.error"
  | "issues.status.update.error"
  | "issues.status.update.success"
  | "issues.submit.error"
  | "issues.update.error"
  | "issues.update.success"
  | "projects.create.error"
  | "projects.create.success"
  | "projects.import.error"
  | "projects.import.success"
  | "projects.import.validationError"
  | "projects.submit.error"
  | "login.error.CredentialsSignin"
  | "login.error.OAuthAccountNotLinked"
  | "login.error.default"
  | "profile.error.invalid-password"
  | "profile.error.invalid-profile"
  | "profile.error.password-mismatch"
  | "profile.error.password-unavailable"
  | "profile.updated.password"
  | "profile.updated.profile"
  | "register.error.AccountExists"
  | "register.error.InvalidInput"
  | "register.error.PasswordMismatch"
  | "register.error.default";

const notificationMessages: Record<NotificationKey, NotificationDefinition> = {
  "comments.create.error": {
    message: "Unable to add comment.",
    severity: "error",
  },
  "comments.create.success": {
    message: "Comment added successfully.",
    severity: "success",
  },
  "comments.delete.error": {
    message: "Unable to delete comment.",
    severity: "error",
  },
  "comments.delete.success": {
    message: "Comment deleted successfully.",
    severity: "success",
  },
  "comments.load.error": {
    message: "Unable to load comments right now.",
    severity: "error",
  },
  "comments.required.error": {
    message: "Comment is required.",
    severity: "error",
  },
  "issues.create.success": {
    message: "Issue created successfully.",
    severity: "success",
  },
  "issues.create.error": {
    message: "Unable to create issue.",
    severity: "error",
  },
  "issues.delete.error": {
    message: "Unable to delete issue.",
    severity: "error",
  },
  "issues.delete.success": {
    message: "Issue deleted successfully.",
    severity: "success",
  },
  "issues.detail.load.error": {
    message: "Unable to load issue.",
    severity: "error",
  },
  "issues.load.error": {
    message: "Unable to load issues right now.",
    severity: "error",
  },
  "issues.status.update.error": {
    message: "Unable to update issue status.",
    severity: "error",
  },
  "issues.status.update.success": {
    message: "Issue status updated successfully.",
    severity: "success",
  },
  "issues.submit.error": {
    message: "Unable to submit issue.",
    severity: "error",
  },
  "issues.update.error": {
    message: "Unable to update issue.",
    severity: "error",
  },
  "issues.update.success": (values) => ({
    message: `Issue #${values?.issueId ?? ""} updated successfully.`,
    severity: "success",
  }),
  "projects.create.error": {
    message: "Unable to create project.",
    severity: "error",
  },
  "projects.create.success": {
    message: "Project created successfully.",
    severity: "success",
  },
  "projects.import.error": {
    message: "Unable to import work breakdown.",
    severity: "error",
  },
  "projects.import.success": (values) => ({
    message: `Imported ${values?.rowsProcessed ?? 0} work breakdown rows.`,
    severity: "success",
  }),
  "projects.import.validationError": {
    message: "Fix the import file and try again.",
    severity: "error",
  },
  "projects.submit.error": {
    message: "Unable to submit project.",
    severity: "error",
  },
  "login.error.CredentialsSignin": {
    message: "Email or password is incorrect.",
    severity: "error",
  },
  "login.error.OAuthAccountNotLinked": {
    message: "This email is already linked to a different sign-in method.",
    severity: "error",
  },
  "login.error.default": {
    message: "Sign in failed. Please try again.",
    severity: "error",
  },
  "profile.error.invalid-password": {
    message: "Use a password between 6 and 128 characters.",
    severity: "error",
  },
  "profile.error.invalid-profile": {
    message: "Use a name with 80 characters or fewer.",
    severity: "error",
  },
  "profile.error.password-mismatch": {
    message: "Passwords must match.",
    severity: "error",
  },
  "profile.error.password-unavailable": {
    message: "Password changes are only available for email sign-in accounts.",
    severity: "error",
  },
  "profile.updated.password": {
    message: "Password updated.",
    severity: "success",
  },
  "profile.updated.profile": {
    message: "Profile settings saved.",
    severity: "success",
  },
  "register.error.AccountExists": {
    message: "This email is already registered.",
    severity: "error",
  },
  "register.error.InvalidInput": {
    message: "Use a valid email and a password with at least 6 characters.",
    severity: "error",
  },
  "register.error.PasswordMismatch": {
    message: "Passwords must match.",
    severity: "error",
  },
  "register.error.default": {
    message: "Registration failed. Please try again.",
    severity: "error",
  },
};

const routeNotificationConfig = {
  login: {
    defaultErrorKey: "login.error.default",
    params: {
      error: "login.error",
    },
  },
  profile: {
    params: {
      error: "profile.error",
      updated: "profile.updated",
    },
  },
  register: {
    defaultErrorKey: "register.error.default",
    params: {
      error: "register.error",
    },
  },
} as const;

type RouteNotificationName = keyof typeof routeNotificationConfig;

type RouteNotificationParams = {
  error?: string;
  updated?: string;
};

const isNotificationKey = (key: string): key is NotificationKey => {
  return key in notificationMessages;
};

export const getNotificationMessage = (
  key: NotificationKey | null | undefined,
  values?: Record<string, NotificationValue>,
): NotificationMessage | null => {
  if (!key) {
    return null;
  }

  const definition = notificationMessages[key];

  if (typeof definition === "function") {
    return definition(values);
  }

  return definition;
};

export const getRouteNotificationKey = (
  routeName: RouteNotificationName,
  params: RouteNotificationParams,
): NotificationKey | null => {
  const routeConfig = routeNotificationConfig[routeName];

  if ("updated" in routeConfig.params && params.updated) {
    const key = `${routeConfig.params.updated}.${params.updated}`;

    return isNotificationKey(key) ? key : null;
  }

  if ("error" in routeConfig.params && params.error) {
    const key = `${routeConfig.params.error}.${params.error}`;

    if (isNotificationKey(key)) {
      return key;
    }

    return "defaultErrorKey" in routeConfig
      ? routeConfig.defaultErrorKey
      : null;
  }

  return null;
};

export const getNotificationText = (
  key: NotificationKey,
  values?: Record<string, NotificationValue>,
) => {
  return getNotificationMessage(key, values)?.message ?? "";
};

export const getNotification = (
  key: NotificationKey,
  values?: Record<string, NotificationValue>,
): NotificationMessage => {
  return getNotificationMessage(key, values) ?? {
    message: "",
    severity: "info",
  };
};
