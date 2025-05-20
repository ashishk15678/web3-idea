"use client"

import { create } from "zustand"

export interface Idea {
  id: number
  name: string
  description: string
  category: string
  price: string
  change: string
  creator: string
  image?: string
}

interface IdeasStore {
  selectedIdea: Idea | null
  isModalOpen: boolean
  selectIdea: (idea: Idea) => void
  closeModal: () => void
}

export const useIdeasStore = create<IdeasStore>((set) => ({
  selectedIdea: null,
  isModalOpen: false,
  selectIdea: (idea) => set({ selectedIdea: idea, isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))
