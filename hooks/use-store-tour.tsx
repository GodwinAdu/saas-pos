import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Step } from 'react-joyride'

interface TourState {
    steps: Step[]
    run: boolean
    completed: boolean
    setSteps: (steps: Step[]) => void
    setRun: (run: boolean) => void
    setCompleted: (completed: boolean) => void
    resetTour: () => void
}

export const useTourStore = create<TourState>()(
    persist(
        (set) => ({
            steps: [],
            run: false,
            completed: false,
            setSteps: (steps) => set({ steps }),
            setRun: (run) => set({ run }),
            setCompleted: (completed) => set({ completed }),
            resetTour: () => set({ steps: [], run: false, completed: false }),
        }),
        {
            name: 'tour-storage',
        }
    )
)

