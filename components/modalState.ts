"use client";

import { useSyncExternalStore } from "react";

type ActiveProject = { id: number; title: string } | null;

type ModalSnapshot = {
  activeProject: ActiveProject;
  isModalOpen: boolean;
};

let openModalCount = 0;
let activeProject: ActiveProject = null;
let snapshot: ModalSnapshot = { activeProject: null, isModalOpen: false };
const listeners = new Set<() => void>();

const emit = () => {
  snapshot = { activeProject, isModalOpen: openModalCount > 0 };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const registerModal = () => {
  openModalCount += 1;
  emit();
};

export const unregisterModal = () => {
  openModalCount = Math.max(0, openModalCount - 1);
  emit();
};

export const setActiveProject = (project: ActiveProject) => {
  activeProject = project;
  emit();
};

export function useModalState() {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
