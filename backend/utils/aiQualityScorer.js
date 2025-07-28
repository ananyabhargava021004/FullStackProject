// utils/aiQualityScorer.js

/**
 * Calculates an AI-based quality score (1 to 10) based on heuristics like:
 * - Description length
 * - Number of tags
 * - Difficulty
 * - Example inputs/outputs
 */

function scoreAIQuality(problem) {
  let score = 5;

  // Score boost based on description length
  const descriptionLength = problem.description?.length || 0;
  if (descriptionLength > 500) score += 1;
  if (descriptionLength > 1000) score += 1;

  // Score boost based on tag count
  const tagCount = problem.tags?.length || 0;
  if (tagCount >= 2) score += 1;
  if (tagCount >= 4) score += 1;

  // Score boost based on difficulty
  if (problem.difficulty === 'Hard') score += 2;
  else if (problem.difficulty === 'Medium') score += 1;
  else if (problem.difficulty === 'Easy') score -= 1;

  // Reward for example input/output presence
  if (problem.exampleInput && problem.exampleOutput) {
    score += 1;
  }

  // Clamp between 1 and 10
  return Math.max(1, Math.min(10, score));
}

module.exports = { scoreAIQuality };
