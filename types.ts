
export interface MarketAnalysis {
  targetAudience: string;
  marketSize: string;
  keyTrends: string;
}

export interface Competitor {
  name: string;
  strengths: string;
  weaknesses:string;
}

export interface SwotAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface ResearchData {
  marketAnalysis: MarketAnalysis;
  competitiveLandscape: Competitor[];
  swotAnalysis: SwotAnalysis;
  featureSuggestions: string[];
  marketingStrategy: string[];
  potentialRisks: string[];
}
