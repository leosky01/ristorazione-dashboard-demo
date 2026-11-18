const periodData = {
  day: {
    context: "Giornata di esempio · nessun dato reale",
    stamp: "OGGI · DEMO",
    revenueTitle: "Fatturato del giorno",
    salesPeriod: "oggi · demo",
    revenue: 2460,
    revenueChange: "+8,2%",
    covers: 86,
    orders: 64,
    foodCost: 28.4,
    beverageCost: 18.6,
    personnelCost: 32.1,
    wasteAmount: 126,
    wasteWeight: 2.3,
    trend: [
      { label: "12", value: 310 }, { label: "13", value: 480 },
      { label: "14", value: 290 }, { label: "15", value: 170 },
      { label: "18", value: 220 }, { label: "19", value: 430 },
      { label: "20", value: 380 }, { label: "21", value: 180 }
    ],
    slot: { pranzo: 870, aperitivo: 390, cena: 1200 },
    category: { cucina: 1410, sala: 420, bar: 630 },
    costs: {
      personale: { actual: 790, budget: 840 },
      materie: { actual: 560, budget: 620 },
      locali: { actual: 105, budget: 105 },
      utenze: { actual: 58, budget: 60 },
      marketing: { actual: 45, budget: 40 },
      altro: { actual: 62, budget: 55 }
    }
  },
  month: {
    context: "Mese di esempio · nessun dato reale",
    stamp: "MESE · DEMO",
    revenueTitle: "Fatturato del mese",
    salesPeriod: "mese in corso · demo",
    revenue: 64820,
    revenueChange: "+4,7%",
    covers: 2014,
    orders: 1672,
    foodCost: 31.2,
    beverageCost: 19.3,
    personnelCost: 31.4,
    wasteAmount: 1880,
    wasteWeight: 38,
    trend: [
      { label: "1", value: 14200 }, { label: "2", value: 15450 },
      { label: "3", value: 16820 }, { label: "4", value: 18350 }
    ],
    slot: { pranzo: 22600, aperitivo: 8140, cena: 34080 },
    category: { cucina: 37900, sala: 11200, bar: 15720 },
    costs: {
      personale: { actual: 20500, budget: 22000 },
      materie: { actual: 18550, budget: 19500 },
      locali: { actual: 3600, budget: 3600 },
      utenze: { actual: 1420, budget: 1350 },
      marketing: { actual: 1130, budget: 950 },
      altro: { actual: 1400, budget: 1350 }
    }
  },
  year: {
    context: "Anno di esempio · nessun dato reale",
    stamp: "ANNO · DEMO",
    revenueTitle: "Fatturato dell’anno",
    salesPeriod: "anno in corso · demo",
    revenue: 716420,
    revenueChange: "+7,1%",
    covers: 23410,
    orders: 18560,
    foodCost: 29.6,
    beverageCost: 18.9,
    personnelCost: 30.8,
    wasteAmount: 12600,
    wasteWeight: 225,
    trend: [
      { label: "Gen", value: 52000 }, { label: "Feb", value: 49500 },
      { label: "Mar", value: 55800 }, { label: "Apr", value: 58900 },
      { label: "Mag", value: 60400 }, { label: "Giu", value: 61200 },
      { label: "Lug", value: 59800 }, { label: "Ago", value: 62500 },
      { label: "Set", value: 60200 }, { label: "Ott", value: 64300 },
      { label: "Nov", value: 63500 }, { label: "Dic", value: 68320 }
    ],
    slot: { pranzo: 248000, aperitivo: 96400, cena: 372020 },
    category: { cucina: 410000, sala: 132000, bar: 174420 },
    costs: {
      personale: { actual: 221000, budget: 235000 },
      materie: { actual: 209000, budget: 218000 },
      locali: { actual: 42000, budget: 43200 },
      utenze: { actual: 16800, budget: 16000 },
      marketing: { actual: 13200, budget: 12000 },
      altro: { actual: 19300, budget: 18000 }
    }
  }
};

const currencyFormatter = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const percentFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const integerFormatter = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });
let activePeriod = "day";

document.documentElement.classList.add("has-js");

function formatEuro(value, decimals = 0) {
  const amount = decimals
    ? decimalFormatter.format(value)
    : currencyFormatter.format(value);
  return `${amount} €`;
}

function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

function setStatus(element, status, label) {
  if (!element) {
    return;
  }

  element.classList.remove("status-good", "status-warning", "status-alert");
  element.classList.add(`status-${status}`);
  const text = element.querySelector("[data-status-text], span:not(:first-child)");
  if (text) {
    text.textContent = label;
  }
}

function statusForRatio(ratio) {
  if (ratio <= 90) {
    return { status: "good", label: "IN LINEA" };
  }
  if (ratio <= 100) {
    return { status: "warning", label: "DA OSSERVARE" };
  }
  return { status: "alert", label: "OLTRE BUDGET" };
}

function updateBoundValues(period) {
  const values = {
    revenue: formatEuro(period.revenue),
    "revenue-change": period.revenueChange,
    covers: integerFormatter.format(period.covers),
    orders: integerFormatter.format(period.orders),
    "average-ticket": formatEuro(period.revenue / period.orders, 2),
    "food-cost": formatPercent(period.foodCost),
    "beverage-cost": formatPercent(period.beverageCost),
    "personnel-cost": formatPercent(period.personnelCost),
    "waste-amount": formatEuro(period.wasteAmount),
    "waste-weight": `${percentFormatter.format(period.wasteWeight)} kg`
  };

  document.querySelectorAll("[data-bind]").forEach((element) => {
    const value = values[element.dataset.bind];
    if (value !== undefined) {
      element.textContent = value;
    }
  });
}

function updateRatioStatuses(period) {
  const targetInput = document.getElementById("food-target");
  const foodTarget = Number(targetInput?.value || 30);
  const statuses = {
    "food-cost": period.foodCost <= foodTarget
      ? { status: "good", label: "IN LINEA" }
      : period.foodCost <= foodTarget + 4
        ? { status: "warning", label: "DA OSSERVARE" }
        : { status: "alert", label: "FUORI SOGLIA" },
    "beverage-cost": period.beverageCost <= 20
      ? { status: "good", label: "IN LINEA" }
      : period.beverageCost <= 24
        ? { status: "warning", label: "DA OSSERVARE" }
        : { status: "alert", label: "FUORI SOGLIA" },
    "personnel-cost": period.personnelCost <= 32
      ? { status: "good", label: "IN LINEA" }
      : period.personnelCost <= 35
        ? { status: "warning", label: "DA OSSERVARE" }
        : { status: "alert", label: "FUORI SOGLIA" }
  };

  Object.entries(statuses).forEach(([key, result]) => {
    document.querySelectorAll(`[data-status-for="${key}"]`).forEach((element) => {
      setStatus(element, result.status, result.label);
    });
  });

  const yellowLimit = foodTarget + 4;
  const currentStatus = statuses["food-cost"];
  const thresholdStatus = document.getElementById("food-threshold-status");
  document.getElementById("food-target-output").textContent = `${foodTarget}%`;
  targetInput?.setAttribute("aria-valuetext", `Soglia demo food cost: ${foodTarget} percento`);
  setStatus(thresholdStatus, currentStatus.status, currentStatus.label);
  document.querySelector(".threshold-legend").setAttribute(
    "aria-label",
    `Verde fino a ${foodTarget} percento, giallo fino a ${yellowLimit} percento, rosso oltre`
  );
}

function updateTrendChart(period) {
  const chart = document.getElementById("overview-chart");
  const maxValue = Math.max(...period.trend.map(({ value }) => value));
  const peakIndex = period.trend.findIndex(({ value }) => value === maxValue);
  const columns = period.trend.map(({ label, value }, index) => {
    const column = document.createElement("div");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const axisLabel = document.createElement("small");

    column.className = `overview-chart-column${index === peakIndex ? " is-peak" : ""}`;
    column.setAttribute("aria-hidden", "true");
    track.className = "overview-bar-track";
    fill.className = "overview-bar-fill";
    fill.style.height = `${Math.max(7, (value / maxValue) * 100)}%`;
    axisLabel.textContent = label;
    track.append(fill);
    column.append(track, axisLabel);
    return column;
  });

  chart.replaceChildren(...columns);
  document.getElementById("overview-chart-summary").textContent =
    `Esempio ${activePeriod === "day" ? "per ora" : activePeriod === "month" ? "per settimana" : "per mese"} · valori simulati, nessun dato reale.`;
}

function updateSalesCharts(period) {
  ["slot", "category"].forEach((group) => {
    const values = period[group];
    const maxValue = Math.max(...Object.values(values));

    document.querySelectorAll(`[data-chart-group="${group}"] .bar-row`).forEach((row) => {
      const value = values[row.dataset.chartKey];
      if (value === undefined) {
        return;
      }

      const fill = row.querySelector("[data-chart-fill]");
      const valueLabel = row.querySelector("[data-chart-value]");
      const progress = Math.round((value / maxValue) * 100);
      fill.style.width = `${progress}%`;
      valueLabel.textContent = formatEuro(value);
      row.querySelector(".bar-track").setAttribute("aria-valuenow", String(progress));
    });
  });
}

function updateCostTable(period) {
  const costLabels = {
    personale: "Personale",
    materie: "Materie prime",
    locali: "Affitto / locali",
    utenze: "Utenze",
    marketing: "Marketing / Social Media",
    altro: "Altro"
  };

  document.querySelectorAll("[data-cost-row]").forEach((row) => {
    const values = period.costs[row.dataset.costRow];
    if (!values) {
      return;
    }

    const variance = values.actual - values.budget;
    const ratio = (values.actual / values.budget) * 100;
    const result = statusForRatio(ratio);
    const statusElement = row.querySelector("[data-cost-status]");
    row.dataset.status = result.status;
    row.querySelector("[data-cost-actual]").textContent = formatEuro(values.actual);
    row.querySelector("[data-cost-budget]").textContent = formatEuro(values.budget);
    row.querySelector("[data-cost-variance]").textContent =
      `${variance > 0 ? "+" : ""}${formatEuro(variance)}`;
    row.querySelector("[data-cost-meter]").style.width = `${Math.min(ratio, 100)}%`;
    row.querySelector("[data-cost-ratio]").textContent = `${Math.round(ratio)}%`;
    setStatus(statusElement, result.status, result.label);
  });

  document.querySelectorAll("[data-overrun-row]").forEach((row) => {
    const values = period.costs[row.dataset.overrunRow];
    const variance = values ? values.actual - values.budget : 0;
    row.hidden = variance <= 0;
    if (variance > 0) {
      row.querySelector("[data-overrun-value]").textContent = `+${formatEuro(variance)}`;
    }
  });

  const overBudget = Object.entries(period.costs)
    .filter(([, values]) => values.actual > values.budget)
    .map(([key]) => costLabels[key]);
  document.getElementById("overrun-summary-text").textContent = overBudget.length
    ? `${overBudget.join(", ")} oltre budget demo`
    : "Nessuna categoria oltre budget demo";
  document.getElementById("overrun-count").textContent = `${overBudget.length} voci`;
}

function updatePeriod(periodKey) {
  const period = periodData[periodKey];
  if (!period) {
    return;
  }

  activePeriod = periodKey;
  document.getElementById("period-context").textContent = period.context;
  document.getElementById("period-stamp").textContent = period.stamp;
  document.getElementById("revenue-period-title").textContent = period.revenueTitle;
  document.getElementById("sales-revenue-label").textContent = period.revenueTitle;
  document.getElementById("sales-period-label").textContent = period.salesPeriod;
  updateBoundValues(period);
  updateTrendChart(period);
  updateSalesCharts(period);
  updateCostTable(period);
  updateRatioStatuses(period);

  document.querySelectorAll(".period-button").forEach((button) => {
    const isActive = button.dataset.period === periodKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.querySelectorAll(".period-button").forEach((button) => {
  button.addEventListener("click", () => updatePeriod(button.dataset.period));
});

document.getElementById("food-target").addEventListener("input", () => {
  updateRatioStatuses(periodData[activePeriod]);
});

const sectionLinks = document.querySelectorAll("[data-section-link]");
const sections = document.querySelectorAll(".dashboard-section");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      sectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link.hash === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-18% 0px -68% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

updatePeriod("day");
