import { create } from 'zustand';
import { Topic, SkillLevel, Question, UserAnswer } from '../types';

interface AppState {
  selectedTopic: Topic | null;
  skillLevel: SkillLevel | null;
  currentStep: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  learningPath: string | null;
  isLoggedIn: boolean;
  myCourses: { courseName: string | null; skillLevel: SkillLevel | null; roadmap: string | null }[];
  setTopic: (topic: Topic) => void;
  setSkillLevel: (level: SkillLevel) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: UserAnswer) => void;
  nextStep: () => void;
  previousStep: () => void;
  setCurrentStep: (step: number) => void;
  setLearningPath: (path: string) => void;
  setIsLoggedIn: (status: boolean) => void;
  reset: () => void;
  setMyCourses: (courseData: { courseName: string | null; skillLevel: SkillLevel | null; roadmap: string | null }) => void;
  removeCourse: (courseName: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedTopic: null,
  skillLevel: null,
  currentStep: 0,
  questions: [],
  userAnswers: [],
  learningPath: null,
  isLoggedIn: false,
  myCourses: [],
  setTopic: (topic) => set({ selectedTopic: topic }),
  setSkillLevel: (level) => set({ skillLevel: level }),
  setQuestions: (questions) => set({ questions }),
  addAnswer: (answer) => set((state) => ({ userAnswers: [...state.userAnswers, answer] })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  setCurrentStep: (step: number) => set({ currentStep: step }), // New setter to directly set currentStep
  setLearningPath: (path) => set({ learningPath: path }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  reset: () => set({
    currentStep: 0,
    userAnswers: [],
    selectedTopic: null,
    skillLevel: null,
    learningPath: null,
    isLoggedIn: false,
    myCourses: [],
  }),
  setMyCourses: (courseData) => set((state) => ({
    myCourses: [...state.myCourses, courseData]
  })),
  removeCourse: (courseName) => set((state) => ({
    myCourses: state.myCourses.filter(course => course.courseName !== courseName)
  })),
}));
