(function () {
  const data = window.FUSION_RESULTS;

  if (!data) {
    return;
  }

  const state = {
    search: "",
    status: "all"
  };

  const statusOptions = [
    "all",
    "Stable today",
    "Experimental but usable",
    "Present in code but not ready"
  ];

  const familyNav = document.getElementById("family-nav");
  const familySections = document.getElementById("family-sections");
  const summaryCards = document.getElementById("summary-cards");
  const heroTitle = document.getElementById("hero-title");
  const heroSummary = document.getElementById("hero-summary");
  const heroLinks = document.getElementById("hero-links");
  const glossaryGrid = document.getElementById("glossary-grid");
  const statusGuide = document.getElementById("status-guide");
  const searchInput = document.getElementById("family-search");
  const statusFilters = document.getElementById("status-filters");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function statusClass(value) {
    return "status-" + slugify(value || "unknown");
  }

  function sanitizeHref(value) {
    const raw = String(value || "").trim();
    if (!raw) {
      return "#";
    }

    if (raw[0] === "#" || raw.startsWith("./") || raw.startsWith("../") || raw[0] === "/") {
      return raw;
    }

    try {
      const parsed = new URL(raw, window.location.href);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.href;
      }
    } catch (error) {
      return "#";
    }

    return "#";
  }

  function renderLinks(links, className) {
    if (!links || !links.length) {
      return "";
    }

    return '<div class="' + className + '">' + links.map(function (link) {
      return (
        '<a href="' + escapeHtml(sanitizeHref(link.href)) + '">' +
        escapeHtml(link.label) +
        "</a>"
      );
    }).join("") + "</div>";
  }

  function renderAnchorLinks(links) {
    if (!links || !links.length) {
      return "";
    }

    return links.map(function (link) {
      return (
        '<a href="' + escapeHtml(sanitizeHref(link.href)) + '">' +
        escapeHtml(link.label) +
        "</a>"
      );
    }).join("");
  }

  function renderTable(columns, rows) {
    if (!rows || !rows.length) {
      return '<div class="empty-state">No benchmark rows recorded yet.</div>';
    }

    return (
      '<div class="table-wrap"><table><thead><tr>' +
      columns.map(function (column) {
        return "<th>" + escapeHtml(column.label) + "</th>";
      }).join("") +
      "</tr></thead><tbody>" +
      rows.map(function (row) {
        return "<tr>" + columns.map(function (column) {
          const value = row[column.key];
          if (column.type === "badge") {
            return (
              '<td><span class="table-pill ' +
              statusClass(value) +
              '">' +
              escapeHtml(value || "n/a") +
              "</span></td>"
            );
          }

          if (column.type === "note") {
            return (
              "<td>" +
              escapeHtml(value || "n/a") +
              (row.notes
                ? '<span class="value-note">' + escapeHtml(row.notes) + "</span>"
                : "") +
              "</td>"
            );
          }

          return "<td>" + escapeHtml(value || "n/a") + "</td>";
        }).join("") + "</tr>";
      }).join("") +
      "</tbody></table></div>"
    );
  }

  function allRowsForMaxContext() {
    return data.families.flatMap(function (family) {
      return family.models.flatMap(function (model) {
        return model.longContext || [];
      });
    });
  }

  function getMaxContextLabel() {
    const rows = allRowsForMaxContext();
    if (!rows.length) {
      return "n/a";
    }

    const best = rows.reduce(function (current, row) {
      return Number(row.ctx) > Number(current.ctx) ? row : current;
    });

    return best.ctx;
  }

  function getFilteredFamilies() {
    return data.families.filter(function (family) {
      const haystack = [
        family.name,
        family.shortName,
        family.architecture,
        family.source
      ].concat((family.models || []).map(function (model) {
        return [model.name, model.size, model.summary, model.sourceFile].join(" ");
      })).join(" ").toLowerCase();

      const matchesSearch = !state.search || haystack.indexOf(state.search) !== -1;
      const familyStatuses = [family.status].concat((family.models || []).map(function (model) {
        return model.status;
      }));
      const matchesStatus = state.status === "all" || familyStatuses.indexOf(state.status) !== -1;
      return matchesSearch && matchesStatus;
    });
  }

  function renderHero() {
    heroTitle.textContent = data.meta.title;
    heroSummary.textContent = data.meta.summary;
    heroLinks.innerHTML = renderAnchorLinks(data.meta.links);

    const totalFamilies = data.families.length;
    const totalModels = data.families.reduce(function (sum, family) {
      return sum + family.models.length;
    }, 0);
    const experimentalCount = data.families.filter(function (family) {
      return family.status === "Experimental but usable";
    }).length;

    const cards = [
      {
        label: "Updated",
        value: data.meta.updated,
        note: data.meta.gpu
      },
      {
        label: "Model families",
        value: String(totalFamilies),
        note: "Organized by family, not just one flat alias list"
      },
      {
        label: "Tiers on page",
        value: String(totalModels),
        note: "Each tier carries its own winner, caveats, and edge checks"
      },
      {
        label: "Best tested context",
        value: getMaxContextLabel(),
        note: "Highest broad pass currently recorded in this site data"
      },
      {
        label: "Build label",
        value: data.meta.buildName,
        note: "The custom fusion fork being benchmarked"
      },
      {
        label: "Experimental families",
        value: String(experimentalCount),
        note: "These are usable, but only after direct card-specific validation"
      }
    ];

    summaryCards.innerHTML = cards.map(function (card) {
      return (
        '<article class="summary-card">' +
        "<span>" + escapeHtml(card.label) + "</span>" +
        "<strong>" + escapeHtml(card.value) + "</strong>" +
        '<p class="muted">' + escapeHtml(card.note) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function renderGlossary() {
    glossaryGrid.innerHTML = data.glossary.map(function (item) {
      return (
        '<article class="glossary-item">' +
        "<strong>" + escapeHtml(item.term) + "</strong>" +
        '<p class="muted">' + escapeHtml(item.description) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function renderStatusGuide() {
    statusGuide.innerHTML = data.statuses.map(function (item) {
      return (
        '<article class="status-item">' +
        '<span class="status-pill ' + statusClass(item.name) + '">' +
        escapeHtml(item.name) +
        "</span>" +
        '<p class="muted">' + escapeHtml(item.summary) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function renderFilters() {
    statusFilters.innerHTML = statusOptions.map(function (option) {
      const isActive = option === state.status;
      return (
        '<button class="filter-button' + (isActive ? " active" : "") + '" data-status="' +
        escapeHtml(option) +
        '">' + escapeHtml(option) + "</button>"
      );
    }).join("");

    Array.from(statusFilters.querySelectorAll("button")).forEach(function (button) {
      button.addEventListener("click", function () {
        state.status = button.getAttribute("data-status");
        renderFamilies();
        renderFilters();
      });
    });
  }

  function renderRecommendedCards(items) {
    if (!items || !items.length) {
      return "";
    }

    return (
      '<div class="recommended-grid">' +
      items.map(function (item) {
        return (
          '<article class="recommended-card">' +
          "<span>" + escapeHtml(item.label) + "</span>" +
          "<strong>" + escapeHtml(item.value) + "</strong>" +
          '<p class="muted">' + escapeHtml(item.supporting) + "</p>" +
          "</article>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderMetricCards(items) {
    if (!items || !items.length) {
      return "";
    }

    return (
      '<div class="metrics-grid">' +
      items.map(function (item) {
        return (
          '<article class="metric-card">' +
          "<span>" + escapeHtml(item.label) + "</span>" +
          "<strong>" + escapeHtml(item.value) + "</strong>" +
          '<p class="muted">' + escapeHtml(item.note) + "</p>" +
          "</article>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderEdgeCards(items) {
    if (!items || !items.length) {
      return '<div class="empty-state">No edge-case checks recorded yet.</div>';
    }

    return (
      '<div class="edge-grid">' +
      items.map(function (item) {
        return (
          '<article class="edge-item">' +
          '<div class="badge-row">' +
          '<span class="status-pill ' + statusClass(item.result) + '">' + escapeHtml(item.result) + "</span>" +
          "</div>" +
          "<strong>" + escapeHtml(item.test) + "</strong>" +
          '<p class="muted">' + escapeHtml(item.notes) + "</p>" +
          "</article>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderModel(model) {
    return (
      '<article class="model-card" id="' + escapeHtml(model.id) + '">' +
      '<div class="model-head">' +
      "<div>" +
      "<h3>" + escapeHtml(model.name) + "</h3>" +
      '<p class="model-summary">' + escapeHtml(model.summary) + "</p>" +
      "</div>" +
      '<div class="badge-row">' +
      '<span class="status-pill ' + statusClass(model.status) + '">' + escapeHtml(model.status) + "</span>" +
      '<span class="metric-pill">' + escapeHtml(model.size) + "</span>" +
      "</div>" +
      "</div>" +
      '<dl class="setting-list">' +
      "<div><dt>Alias</dt><dd>" + escapeHtml(model.recommendedPreset.alias) + "</dd></div>" +
      "<div><dt>Cache</dt><dd>" + escapeHtml(model.recommendedPreset.cache) + "</dd></div>" +
      "<div><dt>ctx</dt><dd>" + escapeHtml(model.recommendedPreset.context) + "</dd></div>" +
      "<div><dt>b / ub</dt><dd>" + escapeHtml(model.recommendedPreset.batch) + "</dd></div>" +
      "<div><dt>fit-target</dt><dd>" + escapeHtml(model.recommendedPreset.fitTarget) + "</dd></div>" +
      "<div><dt>logic</dt><dd>" + escapeHtml(model.recommendedPreset.logic) + "</dd></div>" +
      "<div><dt>prompt tok/s</dt><dd>" + escapeHtml(model.recommendedPreset.promptTps) + "</dd></div>" +
      "<div><dt>decode tok/s</dt><dd>" + escapeHtml(model.recommendedPreset.decodeTps) + "</dd></div>" +
      "</dl>" +
      '<p class="muted">' + escapeHtml(model.recommendedPreset.note) + "</p>" +
      renderMetricCards(model.highlightMetrics) +
      '<section class="table-block">' +
      '<div class="table-title"><h4>KV And Batch Matrix</h4></div>' +
      renderTable([
        { label: "Shape", key: "shape" },
        { label: "ctx", key: "ctx" },
        { label: "b / ub", key: "batch" },
        { label: "Logic", key: "logic" },
        { label: "Prompt", key: "prompt" },
        { label: "Decode", key: "decode" },
        { label: "Verdict", key: "verdict", type: "badge" },
        { label: "Notes", key: "notes" }
      ], model.kvMatrix) +
      "</section>" +
      '<section class="table-block">' +
      '<div class="table-title"><h4>Long-Context Ladder</h4></div>' +
      renderTable([
        { label: "Shape", key: "shape" },
        { label: "ctx", key: "ctx" },
        { label: "b / ub", key: "batch" },
        { label: "fit-target", key: "fitTarget" },
        { label: "Prompt", key: "prompt" },
        { label: "Decode", key: "decode" },
        { label: "Result", key: "result", type: "badge" }
      ], model.longContext) +
      "</section>" +
      '<section class="table-block">' +
      '<div class="table-title"><h4>Speculation</h4></div>' +
      renderTable([
        { label: "Profile", key: "profile" },
        { label: "Decode", key: "decode" },
        { label: "Acceptance", key: "acceptance" },
        { label: "Verdict", key: "verdict", type: "badge" },
        { label: "Notes", key: "notes" }
      ], model.speculation) +
      "</section>" +
      '<section class="table-block">' +
      '<div class="table-title"><h4>Edge Cases</h4></div>' +
      renderEdgeCards(model.edgeCases) +
      "</section>" +
      "</article>"
    );
  }

  function renderFamilies() {
    const families = getFilteredFamilies();

    if (!families.length) {
      familyNav.innerHTML = '<div class="empty-state">No families match the current filters.</div>';
      familySections.innerHTML = '<div class="empty-state">Try a broader search or switch the status filter back to all.</div>';
      return;
    }

    familyNav.innerHTML = families.map(function (family) {
      const modelLinks = (family.models || []).map(function (model) {
        return (
          '<a class="nav-subitem" href="#' + escapeHtml(model.id) + '">' +
          escapeHtml(model.name) +
          "</a>"
        );
      }).join("");

      return (
        '<div class="nav-group">' +
        '<a class="nav-item" href="#' + escapeHtml(family.id) + '">' +
        '<div class="nav-title">' + escapeHtml(family.shortName || family.name) + "</div>" +
        '<div class="badge-row">' +
        '<span class="nav-badge ' + statusClass(family.status) + '">' + escapeHtml(family.status) + "</span>" +
        '<span class="nav-badge">' + escapeHtml(family.architecture) + "</span>" +
        "</div>" +
        "</a>" +
        '<div class="nav-model-list">' + modelLinks + "</div>" +
        "</div>"
      );
    }).join("");

    familySections.innerHTML = families.map(function (family) {
      const tierLinks = family.models.map(function (model) {
        return { label: model.name, href: "#" + model.id };
      });

      return (
        '<section class="family-card" id="' + escapeHtml(family.id) + '">' +
        '<header class="family-header">' +
        "<div>" +
        '<p class="eyebrow">' + escapeHtml(family.architecture) + "</p>" +
        "<h2>" + escapeHtml(family.name) + "</h2>" +
        '<p class="family-summary">' + escapeHtml(family.summary) + "</p>" +
        "</div>" +
        '<div class="badge-row">' +
        '<span class="status-pill ' + statusClass(family.status) + '">' + escapeHtml(family.status) + "</span>" +
        '<span class="metric-pill">' + escapeHtml(family.source) + "</span>" +
        "</div>" +
        "</header>" +
        renderLinks(family.links, "section-links") +
        renderLinks(tierLinks, "section-links") +
        renderRecommendedCards(family.recommended) +
        '<div class="card">' +
        '<div class="section-head"><div><p class="eyebrow">why this family matters</p><h3>What This Family Stresses</h3></div></div>' +
        '<ul class="family-highlight-list">' +
        family.highlights.map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        }).join("") +
        "</ul>" +
        "</div>" +
        '<div class="model-grid">' +
        family.models.map(renderModel).join("") +
        "</div>" +
        "</section>"
      );
    }).join("");
  }

  searchInput.addEventListener("input", function (event) {
    state.search = event.target.value.trim().toLowerCase();
    renderFamilies();
  });

  renderHero();
  renderGlossary();
  renderStatusGuide();
  renderFilters();
  renderFamilies();
})();
