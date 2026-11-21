export const resourceSeeds = [
  {
    subject: "Mathematics",
    cover: "algebra-and-geometry-essentials",
    level: "SSC",
    kind: "Worked example",
    slug: "solving-linear-equations",
    title: "Solving linear equations",
    summary:
      "Isolate the unknown one step at a time and check your answer by substitution.",
    lesson:
      "To solve 3x + 5 = 20, subtract 5 from both sides to get 3x = 15. Then divide both sides by 3 to get x = 5. Check by substituting 5 into the original equation.",
    practice: "Solve 4x − 7 = 13.",
    answer: "x = 5. Add 7 to both sides, then divide by 4.",
  },
  {
    subject: "Physics",
    cover: "motion-forces-and-energy",
    level: "HSC",
    kind: "Study notes",
    slug: "reading-motion-graphs",
    title: "Reading motion graphs",
    summary:
      "Find velocity, acceleration, and displacement from the shape of a graph.",
    lesson:
      "The slope of a displacement–time graph is velocity. The slope of a velocity–time graph is acceleration, and its signed area gives displacement.",
    practice:
      "A cyclist travels at a constant velocity of 6 m/s for 4 seconds. What is the displacement?",
    answer:
      "24 m in the direction of motion. The area under the velocity–time graph is 6 × 4.",
  },
  {
    subject: "Chemistry",
    cover: "chemical-reactions-and-equations",
    level: "O-level",
    kind: "Worked example",
    slug: "balancing-chemical-equations",
    title: "Balancing chemical equations",
    summary:
      "Use coefficients to keep the number of atoms equal on both sides of an equation.",
    lesson:
      "Balance H₂ + O₂ → H₂O by adding a 2 before H₂O to match the oxygen atoms. Then add a 2 before H₂ to match the four hydrogen atoms. Keep the chemical formulas intact.",
    practice: "Balance Mg + O₂ → MgO.",
    answer:
      "2Mg + O₂ → 2MgO. Each side contains two magnesium atoms and two oxygen atoms.",
  },
  {
    subject: "Biology",
    cover: "cells-genetics-and-living-systems",
    level: "HSC",
    kind: "Study notes",
    slug: "inside-a-plant-cell",
    title: "Inside a plant cell",
    summary:
      "Connect the cell wall, chloroplasts, and vacuole to their everyday functions.",
    lesson:
      "The cell wall provides structural support. Chloroplasts capture light energy for photosynthesis. The central vacuole stores water and helps maintain the pressure that keeps the cell firm.",
    practice:
      "Which structure helps a wilted plant regain firmness after watering?",
    answer:
      "The central vacuole fills with water, increasing pressure against the cell wall.",
  },
  {
    subject: "ICT",
    cover: "computing-and-digital-communication",
    level: "HSC",
    kind: "Worked example",
    slug: "binary-numbers-made-simple",
    title: "Binary numbers made simple",
    summary: "Read binary place values and convert a number to decimal.",
    lesson:
      "Binary place values double as you move left: 1, 2, 4, 8, and so on. Add only the place values with a digit of 1. For example, 1011 represents 8 + 2 + 1 = 11.",
    practice: "Convert 11010 from binary to decimal.",
    answer: "26, because the digits with a value of 1 represent 16, 8, and 2.",
  },
  {
    subject: "History",
    cover: "modern-history-and-social-change",
    level: "Degree",
    kind: "Study guide",
    slug: "evaluating-primary-sources",
    title: "Evaluating primary sources",
    summary:
      "Use authorship, audience, and purpose to decide what a source can tell you.",
    lesson:
      "Begin by identifying who created the source, when it was made, and who was meant to read it. Then compare its account with other evidence and note which perspectives are missing.",
    practice:
      "What could a factory owner's letter tell you about working conditions, and what would you check next?",
    answer:
      "It could reveal the owner's account and priorities. Compare it with workers’ testimony and inspection records to check the account.",
  },
  {
    subject: "Sociology",
    cover: "society-culture-and-institutions",
    level: "Honours",
    kind: "Study notes",
    slug: "norms-values-and-social-roles",
    title: "Norms, values, and social roles",
    summary:
      "Tell the difference between shared beliefs, expected behavior, and social responsibilities.",
    lesson:
      "Values are shared ideas about what matters. Norms are expectations for behavior. A role is the set of expectations attached to a social position, such as student or teacher.",
    practice:
      "A student waits their turn to speak during class. Name the norm and a value it reflects.",
    answer:
      "Taking turns is the norm. It can reflect the value of respect for others.",
  },
  {
    subject: "Logic",
    cover: "reasoning-arguments-and-fallacies",
    level: "HSC",
    kind: "Practice exercise",
    slug: "spotting-a-weak-argument",
    title: "Spotting a weak argument",
    summary:
      "Identify a hasty generalization and work out what evidence would strengthen it.",
    lesson:
      "A hasty generalization draws a broad conclusion from too little or unrepresentative evidence. Check how examples were selected and whether relevant cases were left out.",
    practice:
      "Two classmates prefer group work, so everyone in the school must prefer it. What is the problem?",
    answer:
      "Two classmates are too small a sample. Surveying a representative group across classes would provide stronger evidence.",
  },
  {
    subject: "Mathematics",
    cover: "algebra-and-geometry-essentials",
    level: "SSC",
    kind: "Practice exercise",
    slug: "triangle-angles-and-proofs",
    title: "Triangle angles and proofs",
    summary:
      "Use the angle sum of a triangle and explain each step of your reasoning.",
    lesson:
      "The interior angles of a triangle on a flat plane add up to 180°. When two sides are equal, the angles opposite those sides are also equal.",
    practice:
      "An isosceles triangle has a 40° angle between its equal sides. Find the other two angles.",
    answer:
      "Both are 70°. Subtract 40° from 180°, then divide the remaining 140° equally.",
  },
]

export type Resource = (typeof resourceSeeds)[number] & { imageUrl?: string }
