// Pricing logic for interior design estimate calculator

export type ScopeOfWork = 'design-only' | 'design-execution';
export type PropertyStatus = 'under-construction' | 'handed-over' | 'renovation';
export type BHKSize = '3bhk' | '4bhk' | '5bhk';

export interface EstimateInputs {
  scope: ScopeOfWork;
  propertyStatus: PropertyStatus;
  bhkSize?: BHKSize;
}

export interface EstimateResult {
  totalLow: number | null;
  totalHigh: number | null;
  displayText: string;
}

const DESIGN_ONLY_ESTIMATE = {
  totalLow: 0.75,
  totalHigh: null,
  displayText: '₹ 75K',
} as const;

const DESIGN_EXECUTION_RANGES: Record<BHKSize, EstimateResult> = {
  '3bhk': {
    totalLow: 18,
    totalHigh: 25,
    displayText: '₹ 18L - ₹ 25L',
  },
  '4bhk': {
    totalLow: 20,
    totalHigh: 28,
    displayText: '₹ 20L - ₹ 28L',
  },
  '5bhk': {
    totalLow: 25,
    totalHigh: null,
    displayText: '₹ 25L+',
  },
};

export const calculateEstimate = (inputs: EstimateInputs): EstimateResult => {
  if (inputs.scope === 'design-only') {
    return DESIGN_ONLY_ESTIMATE;
  }

  if (!inputs.bhkSize) {
    throw new Error('BHK size is required for Design & Execution estimates.');
  }

  return DESIGN_EXECUTION_RANGES[inputs.bhkSize];
};

// Helper to format currency in Lakhs
export const formatLakhs = (value: number): string => {
  return `₹ ${value.toFixed(1)} L`;
};

// Helper to get size multiplier label
export const getSizeLabel = (bhkSize: BHKSize): string => {
  const labels: Record<BHKSize, string> = {
    '3bhk': '3BHK',
    '4bhk': '4BHK',
    '5bhk': '5BHK+',
  };
  return labels[bhkSize];
};
