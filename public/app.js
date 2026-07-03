const animalNameInput = document.getElementById("animalName");
const speciesInput = document.getElementById("species");
const ageInput = document.getElementById("age");
const durationInput = document.getElementById("duration");
const symptomsInput = document.getElementById("symptoms");
const notesInput = document.getElementById("notes");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");

const statusBadge = document.getElementById("status");
const resultPlaceholder = document.getElementById("resultPlaceholder");
const resultCard = document.getElementById("resultCard");

const fields = {
  animalName: document.getElementById("fieldAnimalName"),
  species: document.getElementById("fieldSpecies"),
  age: document.getElementById("fieldAge"),
  summary: document.getElementById("fieldSummary"),
  hypotheses: document.getElementById("fieldHypotheses"),
  urgency: document.getElementById("fieldUrgency"),
  conduct: document.getElementById("fieldConduct"),
  exams: document.getElementById("fieldExams"),
  referral: document.getElementById("fieldReferral"),
  notes: document.getElementById("fieldNotes")
};

const urgencyFieldCard = fields.urgency.closest(".result-field");

generateBtn.addEventListener("click", generateAnalysis);
clearBtn.addEventListener("click", clearForm);

async function generateAnalysis() {
  const formData = {
    animalName: animalNameInput.value.trim(),
    species: speciesInput.value.trim(),
    age: ageInput.value.trim(),
    duration: durationInput.value.trim(),
    symptoms: symptomsInput.value.trim(),
    notes: notesInput.value.trim()
  };

  if (!formData.symptoms) {
    setStatus("Sintomas obrigatórios");
    showPlaceholder("Informe os sintomas observados antes de gerar a análise.");
    hideResult();
    return;
  }

  setStatus("Gerando análise...");
  showPlaceholder("Consultando a IA...");
  hideResult();

  try {
    const response = await fetch("/api/triagem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("Erro");
      showPlaceholder(
        `${data.erro || "Erro ao gerar análise."}\n\nDetalhe: ${data.detalhe || "não informado"}`
      );
      return;
    }

    renderAnalysis(data.resposta || "");
    setStatus("Análise gerada");
  } catch (error) {
    setStatus("Erro");
    showPlaceholder("Erro ao conectar com a API local.");
  }
}

function renderAnalysis(text) {
  const parsed = parseAnalysis(text);

  setFormattedValue(fields.animalName, parsed["Nome do animal"]);
  setFormattedValue(fields.species, parsed["Espécie"]);
  setFormattedValue(fields.age, parsed["Idade"]);
  setFormattedValue(fields.summary, parsed["Resumo do caso"]);
  setFormattedValue(fields.hypotheses, parsed["Possíveis hipóteses iniciais"]);
  setFormattedValue(fields.urgency, parsed["Nível de urgência"]);
  setFormattedValue(fields.conduct, parsed["Condutas iniciais sugeridas"]);
  setFormattedValue(fields.exams, parsed["Exames ou avaliação recomendada"]);
  setFormattedValue(fields.referral, parsed["Encaminhamento"]);
  setFormattedValue(fields.notes, parsed["Observações importantes"]);

  applyUrgencyStyle(parsed["Nível de urgência"] || "");

  hidePlaceholder();
  showResult();
}

function parseAnalysis(text) {
  if (!text || typeof text !== "string") {
    return {};
  }

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const result = {};
  let currentField = null;

  const fieldMap = {
    "nome do animal": "Nome do animal",
    "espécie": "Espécie",
    "especie": "Espécie",
    "idade": "Idade",
    "resumo do caso": "Resumo do caso",
    "possíveis hipóteses iniciais": "Possíveis hipóteses iniciais",
    "possiveis hipoteses iniciais": "Possíveis hipóteses iniciais",
    "nível de urgência": "Nível de urgência",
    "nivel de urgencia": "Nível de urgência",
    "condutas iniciais sugeridas": "Condutas iniciais sugeridas",
    "exames ou avaliação recomendada": "Exames ou avaliação recomendada",
    "exames ou avaliacao recomendada": "Exames ou avaliação recomendada",
    "encaminhamento": "Encaminhamento",
    "observações importantes": "Observações importantes",
    "observacoes importantes": "Observações importantes"
  };

  for (const rawLine of lines) {
    const line = rawLine
      .replace(/\*\*/g, "")
      .replace(/^#+\s*/, "")
      .trim();

    if (!line) continue;

    if (line.toUpperCase().includes("ANÁLISE INICIAL DE TRIAGEM VETERINÁRIA")) {
      continue;
    }

    const match = line.match(/^([^:]+?)\s*:\s*(.*)$/);

    if (match) {
      const rawField = match[1].trim().toLowerCase();
      const value = match[2].trim();
      const normalizedField = fieldMap[rawField];

      if (normalizedField) {
        currentField = normalizedField;
        result[currentField] = value || "";
        continue;
      }
    }

    if (currentField) {
      result[currentField] += `${result[currentField] ? "\n" : ""}${line}`;
    }
  }

  return result;
}

function setFormattedValue(element, text) {
  element.innerHTML = formatText(text || "Não informado");
}

function formatText(text) {
  if (!text || text.trim() === "") {
    return "Não informado";
  }

  let formatted = text.trim();

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  if (/\b1\.\s/.test(formatted)) {
    const items = formatted
      .split(/\s(?=\d+\.\s)/)
      .map(item => item.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    if (items.length > 0) {
      return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
    }
  }

  if (formatted.includes("- ")) {
    const items = formatted
      .split(/\s-\s|^-\s/)
      .map(item => item.trim())
      .filter(Boolean);

    if (items.length > 1) {
      return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
    }
  }

  return formatted.replace(/\n/g, "<br>");
}

function applyUrgencyStyle(text) {
  urgencyFieldCard.classList.remove(
    "urgency-low",
    "urgency-moderate",
    "urgency-high",
    "urgency-critical"
  );

  const value = text.toLowerCase();

  if (value.includes("crítico") || value.includes("critico")) {
    urgencyFieldCard.classList.add("urgency-critical");
    return;
  }

  if (value.includes("alto")) {
    urgencyFieldCard.classList.add("urgency-high");
    return;
  }

  if (value.includes("moderado")) {
    urgencyFieldCard.classList.add("urgency-moderate");
    return;
  }

  if (value.includes("baixo")) {
    urgencyFieldCard.classList.add("urgency-low");
  }
}

function clearForm() {
  animalNameInput.value = "";
  speciesInput.value = "";
  ageInput.value = "";
  durationInput.value = "";
  symptomsInput.value = "";
  notesInput.value = "";

  clearAnalysisFields();
  hideResult();
  showPlaceholder("A análise gerada pela IA aparecerá aqui.");
  setStatus("Aguardando geração");
}

function clearAnalysisFields() {
  Object.values(fields).forEach(field => {
    field.innerHTML = "Não informado";
  });

  urgencyFieldCard.classList.remove(
    "urgency-low",
    "urgency-moderate",
    "urgency-high",
    "urgency-critical"
  );
}

function setStatus(text) {
  statusBadge.textContent = text;
}

function showPlaceholder(text) {
  resultPlaceholder.textContent = text;
  resultPlaceholder.classList.remove("hidden");
}

function hidePlaceholder() {
  resultPlaceholder.classList.add("hidden");
}

function showResult() {
  resultCard.classList.remove("hidden");
}

function hideResult() {
  resultCard.classList.add("hidden");
}

clearAnalysisFields();
hideResult();
showPlaceholder("A análise gerada pela IA aparecerá aqui.");
setStatus("Aguardando geração");