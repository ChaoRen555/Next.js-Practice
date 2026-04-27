import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type DefaultValues,
  type SubmitHandler,
  useForm,
} from "react-hook-form";

import {
  createIssue,
  deleteIssue,
  type FieldErrors as ApiFieldErrors,
  fetchIssue,
  issueQueryKey,
  fetchIssues,
  issuesListQueryKey,
  issuesQueryKey,
  updateIssue,
  type IssueFormData,
  type IssueItem,
  type IssuesListParams,
} from "@/lib/issues";
import { createIssueSchema } from "@/lib/validationSchemas";

type CreateIssueMutationOptions = {
  onSuccess: (newIssue: IssueItem) => void;
};

type DeleteIssueMutationOptions = {
  onSuccess: (issueId: number) => void;
  onError: (message: string) => void;
};

type UpdateIssueMutationOptions = {
  onSuccess: (updatedIssue: IssueItem) => void;
};

type IssueMutationError = Error & {
  status?: number;
  fieldErrors?: ApiFieldErrors;
};

type UseIssueFormOptions = {
  defaultValues: DefaultValues<IssueFormData>;
};

export const useIssuesQuery = (params: IssuesListParams) => {
  return useQuery({
    queryKey: issuesListQueryKey(params),
    queryFn: () => fetchIssues(params),
  });
};

export const useIssueForm = ({
  defaultValues,
}: UseIssueFormOptions) => {
  const [submitError, setSubmitError] = useState("");
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IssueFormData>({
    defaultValues,
    resolver: zodResolver(createIssueSchema),
  });

  const applyServerFieldErrors = (fieldErrors: ApiFieldErrors) => {
    (Object.entries(fieldErrors) as Array<
      [keyof IssueFormData, string[] | undefined]
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
      const errorWithMeta = mutationError as IssueMutationError;

      if (errorWithMeta.status === 400 && errorWithMeta.fieldErrors) {
        applyServerFieldErrors(errorWithMeta.fieldErrors);
        return;
      }

      setSubmitError(errorWithMeta.message || "Unable to submit issue.");
    }
  };

  const buildSubmitHandler = (
    submitAction: (formData: IssueFormData) => Promise<unknown>,
  ) => {
    const onSubmit: SubmitHandler<IssueFormData> = async (formData) => {
      await handleMutationSubmit(() => submitAction(formData));
    };

    return handleSubmit(onSubmit);
  };

  return {
    control,
    register,
    errors,
    submitError,
    buildSubmitHandler,
  };
};

export const useIssueQuery = (issueId: number) => {
  return useQuery({
    queryKey: issueQueryKey(issueId),
    queryFn: () => fetchIssue(issueId),
    enabled: Number.isInteger(issueId) && issueId > 0,
  });
};

export const useCreateIssueMutation = ({ onSuccess }: CreateIssueMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: IssueFormData) => createIssue(formData),
    onSuccess: async (newIssue) => {
      onSuccess(newIssue);
      await queryClient.invalidateQueries({ queryKey: issuesQueryKey });
    },
  });
};

export const useUpdateIssueMutation = ({ onSuccess }: UpdateIssueMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      issueId,
      formData,
    }: {
      issueId: number;
      formData: IssueFormData;
    }) => updateIssue(issueId, formData),
    onSuccess: async (updatedIssue) => {
      queryClient.setQueryData<IssueItem>(
        issueQueryKey(updatedIssue.id),
        updatedIssue,
      );

      onSuccess(updatedIssue);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: issuesQueryKey }),
        queryClient.invalidateQueries({
          queryKey: issueQueryKey(updatedIssue.id),
        }),
      ]);
    },
  });
};

export const useDeleteIssueMutation = ({
  onSuccess,
  onError,
}: DeleteIssueMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: number) => deleteIssue(issueId),
    onSuccess: async (_, deletedIssueId) => {
      onSuccess(deletedIssueId);
      await queryClient.invalidateQueries({ queryKey: issuesQueryKey });
    },
    onError: (mutationError) => {
      const deleteIssueError = mutationError as Error;
      onError(deleteIssueError.message || "Unable to delete issue.");
    },
  });
};
