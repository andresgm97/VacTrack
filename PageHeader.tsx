import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

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

const { evaluateQuickConsult } = await import(
  pathToFileURL(path.join(rootDir, "src/rules/vaccineEngine.ts")).href
);
const { evaluateHealthyChildVisit } = await import(
  pathToFileURL(path.join(rootDir, "src/rules/healthyChildEngine.ts")).href
);

const asturiasCalendar = JSON.parse(
  fs.readFileSync(path.join(rootDir, "data/asturias-calendar.json"), "utf8")
);
const healthyChildData = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/healthy-child-visits.json"), "utf8")
);

const cases = [
  {
    label: "Edad: 4 meses",
    input: {
      birthDate: "2025-01-01",
      consultationDate: "2025-05-01"
    },
    expected: ["DTPa-PI-Hib-HB", "VNC", "MenB", "Rotavirus"]
  },
  {
    label: "Edad: 12 meses",
    input: {
      birthDate: "2024-01-01",
      consultationDate: "2025-01-01"
    },
    expected: ["SRP", "MenACWY"]
  },
  {
    label: "Edad: 15 meses",
    input: {
      birthDate: "2023-10-01",
      consultationDate: "2025-01-01"
    },
    expected: ["Varicela"]
  },
  {
    label: "Edad: 13 años / 156 meses",
    input: {
      birthDate: "2012-01-01",
      consultationDate: "2025-01-01"
    },
    expected: ["VPH", "MenACWY"]
  },
  {
    label: "Edad: 6 años / 72 meses",
    input: {
      birthDate: "2019-01-01",
      consultationDate: "2025-01-01"
    },
    expected: ["Tdpa-PI", "Varicela"],
    expectedNoteIncludes: "si no vacunado previamente o no enfermedad"
  }
];

function toActualRows(items) {
  return items.map((item) => ({
    id: item.id,
    name: item.title ?? item.name,
    abbreviation: item.abbreviation ?? item.title,
    sourceId: item.sourceId,
    notes: item.notes ?? []
  }));
}

function abbreviations(rows) {
  return rows.map((row) => row.abbreviation);
}

function sameList(left, right) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function noteMatches(rows, expectedText) {
  if (!expectedText) {
    return true;
  }

  return rows.some((row) =>
    row.notes.some((note) =>
      note.toLocaleLowerCase("es").includes(
        expectedText.toLocaleLowerCase("es")
      )
    )
  );
}

const report = cases.map((testCase) => {
  const quick = evaluateQuickConsult(testCase.input, asturiasCalendar);
  const healthy = evaluateHealthyChildVisit(
    testCase.input,
    healthyChildData,
    asturiasCalendar
  );

  const quickRows = toActualRows(quick.recommendations);
  const healthyRows = toActualRows(healthy.expectedVaccines);
  const quickMatches =
    sameList(abbreviations(quickRows), testCase.expected) &&
    noteMatches(quickRows, testCase.expectedNoteIncludes);
  const healthyMatches =
    sameList(abbreviations(healthyRows), testCase.expected) &&
    noteMatches(healthyRows, testCase.expectedNoteIncludes);

  return {
    label: testCase.label,
    input: testCase.input,
    expected: testCase.expected,
    quickConsult: {
      message: quick.message,
      output: quickRows,
      matchesExpected: quickMatches
    },
    healthyChild: {
      message: healthy.message,
      output: healthyRows,
      matchesExpected: healthyMatches
    }
  };
});

for (const item of report) {
  console.log(`\n${item.label}`);
  console.log("Entrada:", JSON.stringify(item.input));
  console.log("Esperado:", item.expected.join(", "));
  console.log(
    "Consulta rápida:",
    JSON.stringify(item.quickConsult.output, null, 2)
  );
  console.log(
    `Consulta rápida coincide: ${item.quickConsult.matchesExpected ? "sí" : "no"}`
  );
  console.log(
    "Revisión niño sano:",
    JSON.stringify(item.healthyChild.output, null, 2)
  );
  console.log(
    `Revisión niño sano coincide: ${
      item.healthyChild.matchesExpected ? "sí" : "no"
    }`
  );
}

if (
  report.some(
    (item) =>
      !item.quickConsult.matchesExpected || !item.healthyChild.matchesExpected
  )
) {
  process.exitCode = 1;
}
