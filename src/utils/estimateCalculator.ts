// Pricing logic for interior design estimate calculator
// All values in ₹ Lakhs

export type ScopeOfWork = 'kitchen-only' | 'kitchen-wardrobes' | 'kitchen-wardrobes-living';
export type FinishLevel = 'essential' | 'premium' | 'luxe';
export type StorageRequirement = 'light' | 'standard' | 'heavy';
export type PropertyStatus = 'under-construction' | 'handed-over' | 'renovation';

export interface EstimateInputs {
  scope: ScopeOfWork;
  finish: FinishLevel;
  storage: StorageRequirement;
  hasElectricalChanges: boolean;
  hasPaintingChanges: boolean;
  propertyStatus: PropertyStatus;
}

export interface EstimateResult {
  totalLow: number;
  totalHigh: number;
  breakdown: {
    carpentryLow: number;
    carpentryHigh: number;
    electricalLow: number;
    electricalHigh: number;
    paintingLow: number;
    paintingHigh: number;
    renovationMultiplier: number;
    finishMultiplier: number;
    storageMultiplier: number;
  };
}

// Base Carpentry Range (₹ Lakh) by Scope
const SCOPE_RANGES: Record<ScopeOfWork, [number, number]> = {
  'kitchen-only': [4.5, 8],
  'kitchen-wardrobes': [10, 18],
  'kitchen-wardrobes-living': [13, 24],
};

// Finish Multipliers
const FINISH_MULTIPLIERS: Record<FinishLevel, number> = {
  'essential': 0.90,
  'premium': 1.00,
  'luxe': 1.25,
};

// Storage Multipliers
const STORAGE_MULTIPLIERS: Record<StorageRequirement, number> = {
  'light': 0.90,
  'standard': 1.00,
  'heavy': 1.20,
};

// Electrical Add (₹ Lakh)
const ELECTRICAL_ADD: [number, number] = [0.9, 1.8];

// Painting Add (₹ Lakh)
const PAINTING_ADD: [number, number] = [0.8, 4.0];

// Renovation Multiplier
const RENOVATION_MULTIPLIER = 1.20;
const NO_RENOVATION_MULTIPLIER = 1.00;

export const calculateEstimate = (inputs: EstimateInputs): EstimateResult => {
  const [baseLow, baseHigh] = SCOPE_RANGES[inputs.scope];
  const finishM = FINISH_MULTIPLIERS[inputs.finish];
  const storageM = STORAGE_MULTIPLIERS[inputs.storage];
  
  const elecLow = inputs.hasElectricalChanges ? ELECTRICAL_ADD[0] : 0;
  const elecHigh = inputs.hasElectricalChanges ? ELECTRICAL_ADD[1] : 0;
  
  const paintLow = inputs.hasPaintingChanges ? PAINTING_ADD[0] : 0;
  const paintHigh = inputs.hasPaintingChanges ? PAINTING_ADD[1] : 0;
  
  const renovM = inputs.propertyStatus === 'renovation' ? RENOVATION_MULTIPLIER : NO_RENOVATION_MULTIPLIER;
  
  // Calculate adjusted carpentry ranges
  const carpentryLow = baseLow * finishM * storageM;
  const carpentryHigh = baseHigh * finishM * storageM;
  
  // Apply formulas
  const totalLow = (carpentryLow + elecLow + paintLow) * renovM;
  const totalHigh = (carpentryHigh + elecHigh + paintHigh) * renovM;
  
  return {
    totalLow: Math.round(totalLow * 10) / 10, // Round to 1 decimal
    totalHigh: Math.round(totalHigh * 10) / 10,
    breakdown: {
      carpentryLow: Math.round(carpentryLow * 10) / 10,
      carpentryHigh: Math.round(carpentryHigh * 10) / 10,
      electricalLow: elecLow,
      electricalHigh: elecHigh,
      paintingLow: paintLow,
      paintingHigh: paintHigh,
      renovationMultiplier: renovM,
      finishMultiplier: finishM,
      storageMultiplier: storageM,
    },
  };
};

// Helper to format currency in Lakhs
export const formatLakhs = (value: number): string => {
  return `₹ ${value.toFixed(1)} L`;
};
