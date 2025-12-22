// Pricing logic for interior design estimate calculator
// All values in ₹ Lakhs

export type ScopeOfWork = 'kitchen-only' | 'kitchen-wardrobes' | 'kitchen-wardrobes-living';
export type FinishLevel = 'essential' | 'premium' | 'luxe';
export type StorageRequirement = 'light' | 'standard' | 'heavy';
export type PropertyStatus = 'under-construction' | 'handed-over' | 'renovation';
export type BHKSize = '3bhk' | '4bhk' | '5bhk';

export interface EstimateInputs {
  scope: ScopeOfWork;
  finish: FinishLevel;
  storage: StorageRequirement;
  hasElectricalChanges: boolean;
  hasPaintingChanges: boolean;
  propertyStatus: PropertyStatus;
  bhkSize: BHKSize;
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
    sizeMultiplier: number;
    bhkSize: BHKSize;
  };
}

// Base Carpentry Range (₹ Lakh) by Scope
const SCOPE_RANGES: Record<ScopeOfWork, [number, number]> = {
  'kitchen-only': [2.5, 4.0],
  'kitchen-wardrobes': [4.5, 8.0],
  'kitchen-wardrobes-living': [5.5, 10.0],
};

// Finish Multipliers
const FINISH_MULTIPLIERS: Record<FinishLevel, number> = {
  'essential': 0.50,
  'premium': 0.90,
  'luxe': 1.25,
};

// Storage Multipliers
const STORAGE_MULTIPLIERS: Record<StorageRequirement, number> = {
  'light': 0.50,
  'standard': 0.90,
  'heavy': 1.20,
};

// Size Multipliers (BHK-based)
const SIZE_MULTIPLIERS: Record<BHKSize, number> = {
  '3bhk': 1.00,
  '4bhk': 1.15,
  '5bhk': 1.35,
};

// Electrical Add (₹ Lakh) - flat addition, not size-scaled
const ELECTRICAL_ADD: [number, number] = [0.3, 0.8];

// Painting Add (₹ Lakh) - flat addition, not size-scaled
const PAINTING_ADD: [number, number] = [0.6, 1.5];

// Renovation Multiplier
const RENOVATION_MULTIPLIER = 1.20;
const NO_RENOVATION_MULTIPLIER = 1.00;

export const calculateEstimate = (inputs: EstimateInputs): EstimateResult => {
  const [baseLow, baseHigh] = SCOPE_RANGES[inputs.scope];
  const finishM = FINISH_MULTIPLIERS[inputs.finish];
  const storageM = STORAGE_MULTIPLIERS[inputs.storage];
  const sizeM = SIZE_MULTIPLIERS[inputs.bhkSize];
  
  // Step 1: Size-adjusted base carpentry
  const baseCarpentryLowSized = baseLow * sizeM;
  const baseCarpentryHighSized = baseHigh * sizeM;
  
  // Step 2: Apply finish and storage multipliers
  const carpentryLow = baseCarpentryLowSized * finishM * storageM;
  const carpentryHigh = baseCarpentryHighSized * finishM * storageM;
  
  // Step 3: Add selected upgrades (flat additions, not size-scaled)
  const elecLow = inputs.hasElectricalChanges ? ELECTRICAL_ADD[0] : 0;
  const elecHigh = inputs.hasElectricalChanges ? ELECTRICAL_ADD[1] : 0;
  const paintLow = inputs.hasPaintingChanges ? PAINTING_ADD[0] : 0;
  const paintHigh = inputs.hasPaintingChanges ? PAINTING_ADD[1] : 0;
  
  // Renovation multiplier
  const renovM = inputs.propertyStatus === 'renovation' ? RENOVATION_MULTIPLIER : NO_RENOVATION_MULTIPLIER;
  
  // Apply formulas: (Carpentry + Electrical + Painting) * RenovM
  const totalLow = (carpentryLow + elecLow + paintLow) * renovM;
  const totalHigh = (carpentryHigh + elecHigh + paintHigh) * renovM;
  
  return {
    totalLow: Math.round(totalLow * 10) / 10, // Round to 1 decimal
    totalHigh: Math.round(totalHigh * 10) / 10,
    breakdown: {
      carpentryLow: Math.round(carpentryLow * 10) / 10,
      carpentryHigh: Math.round(carpentryHigh * 10) / 10,
      electricalLow: Math.round(elecLow * 10) / 10,
      electricalHigh: Math.round(elecHigh * 10) / 10,
      paintingLow: Math.round(paintLow * 10) / 10,
      paintingHigh: Math.round(paintHigh * 10) / 10,
      renovationMultiplier: renovM,
      finishMultiplier: finishM,
      storageMultiplier: storageM,
      sizeMultiplier: sizeM,
      bhkSize: inputs.bhkSize,
    },
  };
};

// Helper to format currency in Lakhs
export const formatLakhs = (value: number): string => {
  return `₹ ${value.toFixed(1)} L`;
};

// Helper to get size multiplier label
export const getSizeLabel = (bhkSize: BHKSize): string => {
  const labels: Record<BHKSize, string> = {
    '3bhk': '3BHK (1.00x)',
    '4bhk': '4BHK (1.15x)',
    '5bhk': '5BHK+ (1.35x)',
  };
  return labels[bhkSize];
};
