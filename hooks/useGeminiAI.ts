import { useState } from 'react';

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      return data.response;
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = (prompt: string) => generateContent(prompt);
  const reviewCode = (code: string) =>
    generateContent(
      `Review the following code and provide suggestions for improvement:\n\n${code}`,
    );
  const generateLearningRecommendations = (logs: string) =>
    generateContent(
      `Based on the following daily logs, suggest learning topics and resources:\n\n${logs}`,
    );
  const generateGoalSuggestions = (userData: string) =>
    generateContent(
      `Based on the following user data, suggest appropriate goals:\n\n${userData}`,
    );
  const analyzeSentiment = (log: string) =>
    generateContent(
      `Analyze the sentiment of the following daily log entry:\n\n${log}`,
    );
  const generateProjectName = (description: string) =>
    generateContent(
      `Generate a creative and catchy project name for a GitHub repository with the following description:\n\n${description}`,
    );
  const generateTags = (log: string) =>
    generateContent(
      `Suggest relevant tags for the following daily log entry:\n\n${log}`,
    );

  return {
    generateInsights,
    reviewCode,
    generateLearningRecommendations,
    generateGoalSuggestions,
    analyzeSentiment,
    generateProjectName,
    generateTags,
    isLoading,
    error,
  };
}
