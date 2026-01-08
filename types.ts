export interface CarDetails {
  make: string;
  model: string;
  year: string;
  symptoms: string;
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface DiagnosisResult {
  faultName: string;
  description: string;
  causes: string[];
  solutions: string[];
  severity: Severity;
}

export type LanguageCode = 'ar' | 'en' | 'fr' | 'es' | 'de';

export interface Translation {
  title: string;
  subtitle: string;
  inputSection: string;
  make: string;
  model: string;
  year: string;
  symptoms: string;
  symptomsPlaceholder: string;
  analyzeButton: string;
  analyzing: string;
  resultsTitle: string;
  possibleCauses: string;
  solutions: string;
  severity: string;
  warning: string;
  safetyTip: string;
  visitMechanic: string;
  footer: string;
  error: string;
  reset: string;
}

export const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];