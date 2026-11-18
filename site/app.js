const demoPeriods = {
  day: {
    context: "Un servizio · esempio dimostrativo",
    revenue: 2460,
    covers: 86,
    orders: 64,
    change: "+8,2%",
    changeLabel: "vs servizio comparabile demo",
    foodCost: 28.4,
    staffCost: 32.1,
    beverageCost: 18.6,
    dueAmount: 3480,
    dueDescription: "entro 7 giorni · demo",
    budget: 81,
    stock: 4,
    stockDescription: "referenze sotto minimo · demo",
    chartTitle: "Fatturato per fascia oraria",
    chartLabels: ["12", "13", "14", "15", "18", "19", "20", "21"],
    chartValues: [150, 290, 410, 170, 120, 420, 650, 250],
    peakDescription: "Nel campione demo, la fascia più forte è alle"
  },
  month: {
    context: "Mese in corso · esempio dimostrativo",
    revenue: 64820,
    covers: 2014,
    orders: 1672,
    change: "+4,7%",
    changeLabel: "vs mese precedente demo",
    foodCost: 31.2,
    staffCost: 31.4,
    beverageCost: 19.3,
    dueAmount: 14800,
    dueDescription: "nel periodo · demo",
    budget: 84,
    stock: 9,
    stockDescription: "referenze sotto minimo · demo",
    chartTitle: "Fatturato per settimana",
    chartLabels: ["Sett. 1", "Sett. 2", "Sett. 3", "Sett. 4"],
    chartValues: [14200, 15450, 16820, 18350],
    peakDescription: "Nel campione demo, la settimana più forte è la"
  },
  year: {
    context: "Anno in corso · esempio dimostrativo",
    revenue: 716420,
    covers: 23410,
    orders: 18560,
    change: "+7,1%",
    changeLabel: "vs anno precedente demo",
    foodCost: 29.6,
    staffCost: 30.8,
    beverageCost: 18.9,
    dueAmount: 45200,
    dueDescription: "impegni in scadenza · demo",
    budget: 88,
    stock: 6,
    stockDescription: "referenze sotto minimo · demo",
    chartTitle: "Fatturato per mese",
    chartLabels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    chartValues: [52000, 49500, 55800, 58900, 60400, 61200, 59800, 62500, 60200, 64300, 63500, 68320],
    peakDescription: "Nel campione demo, il mese più forte è"
  }
};

const numberFormatter = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const percentFormatter = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activePeriod = "day";

document.documentElement.classList.add("has-js");

function formatEuro(value, decimals = 0) {
  const formatted = decimals === 2
    ? decimalFormatter.format(value)
    : numberFormatter.format(value);
  return `${formatted} €`;
}

function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

function animateMetric(element, target, formatter) {
  const current = Number(element.dataset.current || 0);

  if (element.dataset.animationFrame) {
    cancelAnimationFrame(Number(element.dataset.animationFrame));
  }

  if (reducedMotion || current === target) {
    element.textContent = formatter(target);
    element.dataset.current = String(target);
    return;
  }

  const startedAt = performance.now();
  const duration = 540;

  function render(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = current + (target - current) * eased;

    element.textContent = formatter(value);
    element.dataset.current = String(value);

    if (progress < 1) {
      element.dataset.animationFrame = String(requestAnimationFrame(render));
    } else {
      element.textContent = formatter(target);
      element.dataset.current = String(target);
      delete element.dataset.animationFrame;
    }
  }

  element.dataset.animationFrame = String(requestAnimationFrame(render));
}

function updateChart(period) {
  const chartBars = document.getElementById("chart-bars");
  const chartLabels = document.getElementById("chart-labels");
  const chartTitle = document.getElementById("chart-title");
  const chartSummary = document.getElementById("chart-summary");
  const maxValue = Math.max(...period.chartValues);
  const peakIndex = period.chartValues.indexOf(maxValue);
  const bars = [];
  const labels = [];

  chartTitle.textContent = period.chartTitle;
  chartBars.style.setProperty("--bar-count", String(period.chartValues.length));
  chartLabels.style.setProperty("--bar-count", String(period.chartValues.length));

  period.chartValues.forEach((value, index) => {
    const column = document.createElement("div");
    const track = document.createElement("div");
    const fill = document.createElement("span");
    const label = document.createElement("span");
    const axisLabel = document.createElement("span");

    column.className = `chart-column${index === peakIndex ? " is-peak" : ""}`;
    track.className = "bar-track";
    fill.className = "bar-fill";
    fill.style.setProperty("--bar-height", `${Math.max(7, (value / maxValue) * 100)}%`);
    label.className = "chart-column-label";
    label.textContent = formatEuro(value);
    axisLabel.textContent = period.chartLabels[index];
    column.title = `${period.chartLabels[index]} · ${formatEuro(value)} · dato demo`;

    track.append(fill);
    column.append(track, label);
    bars.push(column);
    labels.push(axisLabel);
  });

  chartBars.replaceChildren(...bars);
  chartLabels.replaceChildren(...labels);
  chartSummary.textContent = `${period.peakDescription} ${period.chartLabels[peakIndex]}. Tutti i valori sono simulati.`;
}

function updateCostRow(value, valueId, fillId) {
  document.getElementById(valueId).textContent = formatPercent(value);
  document.getElementById(fillId).style.width = `${Math.min((value / 40) * 100, 100)}%`;
}

function updateThreshold() {
  const targetInput = document.getElementById("food-target");
  const target = Number(targetInput.value);
  const yellowLimit = target + 4;
  const currentFoodCost = demoPeriods[activePeriod].foodCost;
  const status = currentFoodCost <= target
    ? "good"
    : currentFoodCost <= yellowLimit
      ? "warning"
      : "alert";
  const statusLabels = {
    good: "IN LINEA",
    warning: "DA OSSERVARE",
    alert: "FUORI SOGLIA"
  };
  const statusElement = document.getElementById("threshold-status");

  document.getElementById("food-target-output").textContent = `${target}%`;
  document.getElementById("green-limit").textContent = `${target}%`;
  document.getElementById("yellow-limit").textContent = `${yellowLimit}%`;
  document.getElementById("threshold-current-value").textContent = formatPercent(currentFoodCost);
  document.getElementById("threshold-status-text").textContent = statusLabels[status];
  targetInput.setAttribute("aria-valuetext", `Obiettivo food cost demo: ${target} percento`);
  statusElement.classList.remove("status-good", "status-warning", "status-alert");
  statusElement.classList.add(`status-${status}`);
  statusElement.dataset.status = status;
}

function updatePeriod(periodKey) {
  const period = demoPeriods[periodKey];

  if (!period) {
    return;
  }

  activePeriod = periodKey;
  document.getElementById("period-context").textContent = period.context;
  document.getElementById("revenue-change").textContent = period.change;
  document.getElementById("revenue-change-label").textContent = period.changeLabel;
  document.getElementById("due-value").textContent = formatEuro(period.dueAmount);
  document.getElementById("due-description").textContent = period.dueDescription;
  document.getElementById("budget-value").textContent = `${period.budget}%`;
  document.getElementById("stock-value").textContent = String(period.stock);
  document.getElementById("stock-description").textContent = period.stockDescription;

  animateMetric(document.getElementById("revenue-value"), period.revenue, formatEuro);
  animateMetric(document.getElementById("covers-value"), period.covers, numberFormatter.format);
  animateMetric(document.getElementById("orders-value"), period.orders, numberFormatter.format);
  animateMetric(document.getElementById("average-value"), period.revenue / period.orders, (value) => formatEuro(value, 2));

  updateCostRow(period.foodCost, "food-cost-value", "food-cost-fill");
  updateCostRow(period.staffCost, "staff-cost-value", "staff-cost-fill");
  updateCostRow(period.beverageCost, "beverage-cost-value", "beverage-cost-fill");
  updateChart(period);
  updateThreshold();

  document.querySelectorAll(".period-button").forEach((button) => {
    const isActive = button.dataset.period === periodKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.querySelectorAll(".period-button").forEach((button) => {
  button.addEventListener("click", () => updatePeriod(button.dataset.period));
});

document.getElementById("food-target").addEventListener("input", updateThreshold);

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Apri navigazione");
  primaryNavigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Apri navigazione" : "Chiudi navigazione");
  primaryNavigation.classList.toggle("is-open", !isExpanded);
});

primaryNavigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

const revealElements = document.querySelectorAll("[data-reveal]");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

updatePeriod("day");
