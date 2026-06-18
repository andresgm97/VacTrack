import type {
  AcceleratedCalendarData,
  AntigenEvaluationResult,
  AntigenSeries,
  ExpandedAntigenDose,
  PreviousDoseInput,
  VaccineProduct
} from "../types";
import { PENDING_OFFICIAL_SOURCE } from "../types";
import { calculateAgeInMonths } from "./dateUtils";

export interface AcceleratedInput {
  birthDate: string;
  consultationDate: string;
  knownDosesSummary?: string;
  previousDoses?: PreviousDoseInput[];
}

export interface AcceleratedResult {
  ageMonths: number | null;
  status: "ready" | "blocked";
  message: string;
  ruleCount: number;
  byAntigen: AntigenEvaluationResult[];
}

export type ExpandedDoseGroups = Record<string, ExpandedAntigenDose[]>;

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function expandPreviousDosesToAntigens(
  previousDoses: PreviousDoseInput[],
  vaccineProducts: VaccineProduct[]
): ExpandedAntigenDose[] {
  const productById = new Map(
    vaccineProducts.map((product) => [product.id, product])
  );

  return previousDoses.flatMap((dose) => {
    const productAntigenIds = dose.productId
      ? productById.get(dose.productId)?.antigenIds ?? []
      : [];
    const antigenIds = unique([...productAntigenIds, ...dose.antigenIds]);

    return antigenIds.map((antigenId) => ({
      originalDoseId: dose.id,
      antigenId,
      productId: dose.productId,
      date: dose.date,
      documented: dose.documented,
      source: dose.source
    }));
  });
}

export function groupExpandedDosesByAntigen(
  expandedDoses: ExpandedAntigenDose[]
): ExpandedDoseGroups {
  return expandedDoses.reduce<ExpandedDoseGroups>((groups, dose) => {
    groups[dose.antigenId] ??= [];
    groups[dose.antigenId].push(dose);
    return groups;
  }, {});
}

export function evaluateAntigenSeries(
  series: AntigenSeries,
  expandedDoses: ExpandedAntigenDose[],
  ageMonths: number | null
): AntigenEvaluationResult {
  const sortedDoses = [...expandedDoses].sort((left, right) =>
    left.date.localeCompare(right.date)
  );

  if (
    series.status !== "verified" ||
    series.doseRules.length === 0 ||
    series.catchUpRules.length === 0
  ) {
    return {
      antigenId: series.antigenId,
      ageMonths,
      validDoses: [],
      invalidDoses: sortedDoses.map((dose) => ({
        originalDoseId: dose.originalDoseId,
        antigenId: dose.antigenId,
        productId: dose.productId,
        date: dose.date,
        valid: false,
        countedAsDoseNumber: null,
        reasons: [PENDING_OFFICIAL_SOURCE],
        sourceId: null
      })),
      nextAction: {
        status: "blocked",
        message: PENDING_OFFICIAL_SOURCE,
        nextDoseNumber: null,
        earliestDate: null,
        sourceId: null
      }
    };
  }

  return {
    antigenId: series.antigenId,
    ageMonths,
    validDoses: [],
    invalidDoses: [],
    nextAction: {
      status: "blocked",
      message: PENDING_OFFICIAL_SOURCE,
      nextDoseNumber: null,
      earliestDate: null,
      sourceId: null
    }
  };
}

export function evaluateAcceleratedCalendar(
  input: AcceleratedInput,
  data: AcceleratedCalendarData
): AcceleratedResult {
  const age = calculateAgeInMonths(input.birthDate, input.consultationDate);
  const previousDoses = input.previousDoses ?? [];
  const expandedDoses = expandPreviousDosesToAntigens(
    previousDoses,
    data.vaccineProducts
  );
  const groupedDoses = groupExpandedDosesByAntigen(expandedDoses);
  const ruleCount = data.antigenSeries.reduce(
    (total, series) =>
      total + series.doseRules.length + series.catchUpRules.length,
    0
  );

  if (age.error || age.ageMonths === null) {
    return {
      ageMonths: null,
      status: "blocked",
      message: age.error ?? PENDING_OFFICIAL_SOURCE,
      ruleCount,
      byAntigen: []
    };
  }

  if (data.status !== "verified" || !data.officialDataStructured) {
    return {
      ageMonths: age.ageMonths,
      status: "blocked",
      message: data.fallback.message || PENDING_OFFICIAL_SOURCE,
      ruleCount,
      byAntigen: []
    };
  }

  const byAntigen = data.antigenSeries.map((series) =>
    evaluateAntigenSeries(
      series,
      groupedDoses[series.antigenId] ?? [],
      age.ageMonths
    )
  );

  return {
    ageMonths: age.ageMonths,
    status: byAntigen.every((result) => result.nextAction.status === "ready")
      ? "ready"
      : "blocked",
    message: byAntigen.every((result) => result.nextAction.status === "ready")
      ? "Calendario acelerado calculado desde reglas oficiales estructuradas."
      : PENDING_OFFICIAL_SOURCE,
    ruleCount,
    byAntigen
  };
}

export function evaluateAcceleratedSchedule(
  input: AcceleratedInput,
  data: AcceleratedCalendarData
): AcceleratedResult {
  return evaluateAcceleratedCalendar(input, data);
}
