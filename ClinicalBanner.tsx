import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
      const parentUrl = context.parentURL ?? pathToFileURL(rootDir).href;
      const candidate = fileURLToPath(new URL(specifier, parentUrl));
      const tsFile = `${candidate}.ts`;
      const tsIndex = path.join(candidate, "index.ts");

      if (fs.existsSync(tsFile)) {
        return nextResolve(pathToFileURL(tsFile).href, context);
      }

      if (fs.existsSync(tsIndex)) {
        return nextResolve(pathToFileURL(tsIndex).href, context);
      }
    }

    return nextResolve(specifier, context);
  }
});

const {
  expandPreviousDosesToAntigens,
  groupExpandedDosesByAntigen,
  evaluateAcceleratedCalendar
} = await import(
  pathToFileURL(path.join(rootDir, "src/rules/acceleratedEngine.ts")).href
);

const fallbackMessage = "Pendiente de implementar con fuente oficial estructurada";

const fictitiousProducts = [
  {
    id: "combo-test",
    name: "Producto combinado ficticio",
    abbreviations: ["COMBO"],
    antigenIds: ["alpha", "beta", "gamma"],
    sourceId: "source-test"
  }
];

const previousDoses = [
  {
    id: "dose-combo",
    productId: "combo-test",
    antigenIds: [],
    date: "2024-03-01",
    documented: true,
    source: "cartilla",
    notes: []
  },
  {
    id: "dose-single",
    productId: null,
    antigenIds: ["delta"],
    date: "2024-04-01",
    documented: true,
    source: "cartilla",
    notes: []
  }
];

const expanded = expandPreviousDosesToAntigens(
  previousDoses,
  fictitiousProducts
);

assert.deepEqual(
  expanded
    .filter((dose) => dose.originalDoseId === "dose-combo")
    .map((dose) => dose.antigenId),
  ["alpha", "beta", "gamma"],
  "A combined product should expand into each antigen it contains."
);

const grouped = groupExpandedDosesByAntigen(expanded);

assert.equal(grouped.alpha.length, 1);
assert.equal(grouped.beta.length, 1);
assert.equal(grouped.gamma.length, 1);
assert.equal(grouped.delta.length, 1);
assert.equal(
  grouped.delta[0].originalDoseId,
  "dose-single",
  "A direct antigen dose should be grouped under its antigenId."
);

const pendingCalendar = {
  schemaVersion: "0.2.0",
  calendarId: "fictitious-pending-calendar",
  title: "Fictitious pending calendar",
  status: "pending",
  officialDataStructured: false,
  clinicalSafetyNotice: "Fictitious test calendar.",
  sourceIds: ["source-test"],
  antigenCatalog: [
    {
      id: "alpha",
      name: "Alpha",
      abbreviations: ["A"],
      sourceId: "source-test"
    }
  ],
  vaccineProducts: fictitiousProducts,
  antigenSeries: [
    {
      id: "alpha-series",
      antigenId: "alpha",
      targetGroup: "pediatric",
      status: "pending",
      minimumAgeMonths: null,
      maximumAgeMonths: null,
      totalRequiredDoses: null,
      doseRules: [],
      catchUpRules: []
    }
  ],
  fallback: {
    message: fallbackMessage
  }
};

const result = evaluateAcceleratedCalendar(
  {
    birthDate: "2024-01-01",
    consultationDate: "2025-01-01",
    previousDoses
  },
  pendingCalendar
);

assert.equal(result.status, "blocked");
assert.equal(result.message, fallbackMessage);
assert.equal(result.byAntigen.length, 0);

console.log("Accelerated antigen engine structure OK");
