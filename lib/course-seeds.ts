import { z } from "zod"

export const courseMode = z.enum(["Online", "Physical"])
export const courseClass = z.enum([
  "HSC",
  "SSC",
  "Honours",
  "Degree",
  "O-level",
])

export type Course = {
  slug: string
  topic: string
  title: string
  duration: string
  level: "Beginner" | "Intermediate"
  mode: z.infer<typeof courseMode>
  classLevel: z.infer<typeof courseClass>
  fee: number
  description: string
  outcomes: string[]
  imageUrl?: string
}

export const recommended: Course[] = [
  {
    topic: "Mathematics",
    slug: "algebra-and-geometry-essentials",
    fee: 1200,
    description:
      "Build a foundation in algebra and geometry through worked examples and practice with SSC-level problems.",
    outcomes: [
      "Simplify algebraic expressions and solve linear equations",
      "Use angle and triangle properties to solve geometry problems",
      "Apply algebra and geometry to multi-step questions",
    ],
    mode: "Online",
    classLevel: "SSC",
    title: "Algebra and geometry essentials",
    duration: "4 hours",
    level: "Beginner",
  },
  {
    topic: "Physics",
    slug: "motion-forces-and-energy",
    fee: 1500,
    description:
      "Connect the equations of mechanics to everyday motion and build confidence solving HSC-level physics problems.",
    outcomes: [
      "Interpret displacement and velocity graphs",
      "Use Newton’s laws and draw free-body diagrams",
      "Solve problems using work and conservation of energy",
    ],
    mode: "Physical",
    classLevel: "HSC",
    title: "Motion, forces, and energy",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    topic: "Chemistry",
    slug: "chemical-reactions-and-equations",
    fee: 1100,
    description:
      "Learn to represent chemical changes clearly, from identifying reactants and products to balancing equations.",
    outcomes: [
      "Write word and symbol equations for common reactions",
      "Balance equations using conservation of mass",
      "Recognize common reaction types from their equations",
    ],
    mode: "Physical",
    classLevel: "O-level",
    title: "Chemical reactions and equations",
    duration: "2 hours",
    level: "Beginner",
  },
  {
    topic: "Biology",
    slug: "cells-genetics-and-living-systems",
    fee: 1300,
    description:
      "Explore how cells work, how traits are inherited, and how organisms are organized into living systems.",
    outcomes: [
      "Compare the structures of plant and animal cells",
      "Predict simple patterns of inheritance",
      "Explain how cells, tissues, and organs work together",
    ],
    mode: "Online",
    classLevel: "HSC",
    title: "Cells, genetics, and living systems",
    duration: "3 hours",
    level: "Beginner",
  },
]

export const popular: Course[] = [
  {
    topic: "ICT",
    slug: "computing-and-digital-communication",
    fee: 1600,
    description:
      "Understand how computers represent information and how networks move it between devices.",
    outcomes: [
      "Identify the roles of common hardware and software",
      "Explain how computers represent data in binary",
      "Describe how devices communicate over a network",
    ],
    mode: "Online",
    classLevel: "HSC",
    title: "Computing and digital communication",
    duration: "5 hours",
    level: "Beginner",
  },
  {
    topic: "History",
    slug: "modern-history-and-social-change",
    fee: 1400,
    description:
      "Use historical evidence to examine how industrialization, political movements, and migration reshaped modern societies.",
    outcomes: [
      "Evaluate primary sources in their historical context",
      "Trace the social effects of industrialization and migration",
      "Build a historical argument using evidence",
    ],
    mode: "Physical",
    classLevel: "Degree",
    title: "Modern history and social change",
    duration: "4 hours",
    level: "Beginner",
  },
  {
    topic: "Sociology",
    slug: "society-culture-and-institutions",
    fee: 1350,
    description:
      "Use sociological concepts to examine how culture, social norms, and institutions shape everyday life.",
    outcomes: [
      "Distinguish norms, values, and social roles",
      "Compare sociological perspectives on institutions",
      "Apply those perspectives to an example of social change",
    ],
    mode: "Online",
    classLevel: "Honours",
    title: "Society, culture, and institutions",
    duration: "3 hours",
    level: "Intermediate",
  },
  {
    topic: "Logic",
    slug: "reasoning-arguments-and-fallacies",
    fee: 1250,
    description:
      "Practice breaking arguments into their parts and evaluating whether their conclusions follow from the evidence.",
    outcomes: [
      "Identify premises and conclusions",
      "Distinguish deductive reasoning from inductive reasoning",
      "Spot common fallacies in everyday arguments",
    ],
    mode: "Physical",
    classLevel: "HSC",
    title: "Reasoning, arguments, and fallacies",
    duration: "4 hours",
    level: "Beginner",
  },
]

export const allCourses = [...recommended, ...popular]
