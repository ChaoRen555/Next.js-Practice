import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createIssue,
  deleteIssue,
  fetchIssue,
  issueQueryKey,
  fetchIssues,
  issuesQueryKey,
  type IssueFormData,
  type IssueItem,
} from "@/lib/issues";

type CreateIssueMutationOptions = {
  onSuccess: (newIssue: IssueItem) => void;
};

type DeleteIssueMutationOptions = {
  onSuccess: (issueId: number) => void;
  onError: (message: string) => void;
};

export const useIssuesQuery = () => {
  return useQuery({
    queryKey: issuesQueryKey,
    queryFn: fetchIssues,
  });
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
      queryClient.setQueryData<IssueItem[]>(issuesQueryKey, (current = []) => {
        return [newIssue, ...current];
      });

      onSuccess(newIssue);
      await queryClient.invalidateQueries({ queryKey: issuesQueryKey });
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
      queryClient.setQueryData<IssueItem[]>(issuesQueryKey, (current = []) => {
        return current.filter((issue) => issue.id !== deletedIssueId);
      });

      onSuccess(deletedIssueId);
      await queryClient.invalidateQueries({ queryKey: issuesQueryKey });
    },
    onError: (mutationError) => {
      const deleteIssueError = mutationError as Error;
      onError(deleteIssueError.message || "Unable to delete issue.");
    },
  });
};
