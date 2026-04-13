import { create } from "zustand";

type IssuesUiStore = {
  selectedIssueId: number | null;
  issueToDeleteId: number | null;
  isCreateDialogOpen: boolean;
  deleteError: string;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openIssueDetails: (issueId: number) => void;
  closeIssueDetails: () => void;
  openDeleteDialog: (issueId: number) => void;
  closeDeleteDialog: () => void;
  setDeleteError: (message: string) => void;
  handleCreateSuccess: (issueId: number) => void;
  handleDeleteSuccess: (issueId: number) => void;
};

export const useIssuesUiStore = create<IssuesUiStore>((set) => ({
  selectedIssueId: null,
  issueToDeleteId: null,
  isCreateDialogOpen: false,
  deleteError: "",
  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () =>
    set({
      isCreateDialogOpen: false,
    }),
  openIssueDetails: (issueId) => set({ selectedIssueId: issueId }),
  closeIssueDetails: () => set({ selectedIssueId: null }),
  openDeleteDialog: (issueId) =>
    set({
      issueToDeleteId: issueId,
      deleteError: "",
    }),
  closeDeleteDialog: () =>
    set({
      issueToDeleteId: null,
      deleteError: "",
    }),
  setDeleteError: (message) => set({ deleteError: message }),
  handleCreateSuccess: (issueId) =>
    set({
      isCreateDialogOpen: false,
      selectedIssueId: issueId,
    }),
  handleDeleteSuccess: (issueId) =>
    set((state) => ({
      issueToDeleteId: null,
      deleteError: "",
      selectedIssueId:
        state.selectedIssueId === issueId ? null : state.selectedIssueId,
    })),
}));
