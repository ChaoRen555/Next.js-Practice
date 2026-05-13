"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type DefaultValues,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import {
  createProject,
  type FieldErrors as ApiFieldErrors,
  type ProjectFormData,
  type ProjectItem,
  projectsQueryKey,
} from "@/lib/projects";
import { getNotificationText } from "@/lib/notifications";
import { createProjectSchema } from "@/lib/validationSchemas";

type CreateProjectMutationOptions = {
  onSuccess: (newProject: ProjectItem) => void;
};

type ProjectMutationError = Error & {
  status?: number;
  fieldErrors?: ApiFieldErrors;
};

type UseProjectFormOptions = {
  defaultValues: DefaultValues<ProjectFormData>;
};

export const useProjectForm = ({
  defaultValues,
}: UseProjectFormOptions) => {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues,
    resolver: zodResolver(createProjectSchema),
  });

  const applyServerFieldErrors = (fieldErrors: ApiFieldErrors) => {
    (Object.entries(fieldErrors) as Array<
      [keyof ProjectFormData, string[] | undefined]
    >).forEach(([fieldName, messages]) => {
      if (!messages?.length) {
        return;
      }

      setError(fieldName, {
        type: "server",
        message: messages[0],
      });
    });
  };

  const handleMutationSubmit = async (submitAction: () => Promise<unknown>) => {
    setSubmitError("");
    clearErrors();

    try {
      await submitAction();
    } catch (mutationError) {
      const errorWithMeta = mutationError as ProjectMutationError;

      if (errorWithMeta.status === 400 && errorWithMeta.fieldErrors) {
        applyServerFieldErrors(errorWithMeta.fieldErrors);
        return;
      }

      setSubmitError(
        errorWithMeta.message || getNotificationText("projects.submit.error"),
      );
    }
  };

  const buildSubmitHandler = (
    submitAction: (formData: ProjectFormData) => Promise<unknown>,
  ) => {
    const onSubmit: SubmitHandler<ProjectFormData> = async (formData) => {
      await handleMutationSubmit(() => submitAction(formData));
    };

    return handleSubmit(onSubmit);
  };

  return {
    register,
    errors,
    submitError,
    buildSubmitHandler,
  };
};

export const useCreateProjectMutation = ({
  onSuccess,
}: CreateProjectMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: ProjectFormData) => createProject(formData),
    onSuccess: async (newProject) => {
      onSuccess(newProject);
      await queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
};
