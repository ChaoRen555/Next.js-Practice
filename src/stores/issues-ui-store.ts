import { create } from "zustand";

import {
  type FieldErrors,
  type IssueFormData,
  initialIssueFormData,
} from "@/lib/issues";

type IssuesUiStore = {
  selectedIssueId: number | null;
  issueToDeleteId: number | null;
  isCreateDialogOpen: boolean;
  formData: IssueFormData;
  fieldErrors: FieldErrors;
  submitError: string;
  deleteError: string;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  setFormValue: (name: keyof IssueFormData, value: string) => void;
  setFieldErrors: (fieldErrors: FieldErrors) => void;
  setSubmitError: (message: string) => void;
  resetFormState: () => void;
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
  formData: initialIssueFormData,
  fieldErrors: {},
  submitError: "",
  deleteError: "",
  openCreateDialog: () =>
    set({
      isCreateDialogOpen: true,
      submitError: "",
      fieldErrors: {},
    }),
  closeCreateDialog: () =>
    set({
      isCreateDialogOpen: false,
      formData: initialIssueFormData,
      fieldErrors: {},
      submitError: "",
    }),
  setFormValue: (name, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
      fieldErrors: {
        ...state.fieldErrors,
        [name]: undefined,
      },
      submitError: "",
    })),
  setFieldErrors: (fieldErrors) => set({ fieldErrors }),
  setSubmitError: (message) => set({ submitError: message }),
  resetFormState: () =>
    set({
      formData: initialIssueFormData,
      fieldErrors: {},
      submitError: "",
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
      formData: initialIssueFormData,
      fieldErrors: {},
      submitError: "",
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
