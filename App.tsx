
import React, { useState, useCallback } from 'react';
import { getProductResearch } from './services/geminiService';
import type { ResearchData } from './types';
import ResearchCard from './components/ResearchCard';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [productIdea, setProductIdea] = useState<string>('');
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = useCallback(async () => {
    if (!productIdea.trim()) {
      setError('Please enter a product idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResearchData(null);

    try {
      const data = await getProductResearch(productIdea);
      setResearchData(data);
    } catch (err) {
      setError('An error occurred while fetching research data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [productIdea]);
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleResearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Product <span className="text-sky-400">Scout AI</span>
          </h1>
          <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Leverage AI to get instant, comprehensive market research for your next big idea.
          </p>
        </header>

        <main>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-slate-700 sticky top-4 z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <textarea
                value={productIdea}
                onChange={(e) => setProductIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your product idea... e.g., 'A smart water bottle that tracks hydration and glows to remind you to drink.'"
                className="flex-grow bg-slate-900 border border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-300 resize-none h-24 md:h-auto"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleResearch}
                disabled={isLoading || !productIdea.trim()}
                className="w-full md:w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : 'Research'}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">{error}</div>}
            
            {isLoading && (
              <div className="text-center py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-800 p-6 rounded-xl animate-pulse-fast">
                      <div className="h-8 w-8 bg-slate-700 rounded-md mb-4"></div>
                      <div className="h-6 w-3/4 bg-slate-700 rounded-md mb-4"></div>
                      <div className="h-4 w-full bg-slate-700 rounded-md mb-2"></div>
                      <div className="h-4 w-5/6 bg-slate-700 rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!isLoading && !researchData && !error && (
              <div className="text-center py-20">
                <div className="inline-block bg-slate-800 p-6 rounded-full text-sky-400 mb-4">
                  {ICONS.lightbulb}
                </div>
                <h2 className="text-2xl font-bold text-white">Your Research Report Awaits</h2>
                <p className="text-slate-400 mt-2">Enter your idea above to get started.</p>
              </div>
            )}

            {researchData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResearchCard title="Market Analysis" icon={ICONS.market}>
                  <p className="text-slate-400 mb-2"><strong className="text-slate-200">Target Audience:</strong> {researchData.marketAnalysis.targetAudience}</p>
                  <p className="text-slate-400 mb-2"><strong className="text-slate-200">Market Size:</strong> {researchData.marketAnalysis.marketSize}</p>
                  <p className="text-slate-400"><strong className="text-slate-200">Key Trends:</strong> {researchData.marketAnalysis.keyTrends}</p>
                </ResearchCard>

                <ResearchCard title="Competitive Landscape" icon={ICONS.competitors}>
                  <ul className="space-y-4">
                    {researchData.competitiveLandscape.map((c, i) => (
                      <li key={i} className="p-3 bg-slate-900/50 rounded-md">
                        <h4 className="font-bold text-sky-400">{c.name}</h4>
                        <p className="text-sm text-slate-400"><strong className="text-slate-300">Strengths:</strong> {c.strengths}</p>
                        <p className="text-sm text-slate-400"><strong className="text-slate-300">Weaknesses:</strong> {c.weaknesses}</p>
                      </li>
                    ))}
                  </ul>
                </ResearchCard>

                <ResearchCard title="SWOT Analysis" icon={ICONS.swot}>
                  <div className="space-y-3">
                    <p className="text-slate-400"><strong className="text-green-400">Strengths:</strong> {researchData.swotAnalysis.strengths}</p>
                    <p className="text-slate-400"><strong className="text-red-400">Weaknesses:</strong> {researchData.swotAnalysis.weaknesses}</p>
                    <p className="text-slate-400"><strong className="text-yellow-400">Opportunities:</strong> {researchData.swotAnalysis.opportunities}</p>
                    <p className="text-slate-400"><strong className="text-purple-400">Threats:</strong> {researchData.swotAnalysis.threats}</p>
                  </div>
                </ResearchCard>

                <ResearchCard title="Feature Suggestions" icon={ICONS.features}>
                  <ul className="list-disc list-inside space-y-2 text-slate-400">
                    {researchData.featureSuggestions.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </ResearchCard>
                
                <ResearchCard title="Marketing Strategy" icon={ICONS.marketing}>
                  <ul className="list-disc list-inside space-y-2 text-slate-400">
                    {researchData.marketingStrategy.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </ResearchCard>

                 <ResearchCard title="Potential Risks" icon={ICONS.risks}>
                  <ul className="list-disc list-inside space-y-2 text-slate-400">
                    {researchData.potentialRisks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </ResearchCard>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
