document.addEventListener("DOMContentLoaded", () => {
  // State
  let applications = [];
  let leetcodeProblems = [];
  let outreachs = [];
  let learningState = {
    skill: "",
    goal: "",
    progress: [false, false, false, false],
  };

  // DOM Elements
  const mainNav = document.getElementById("main-nav");
  const contentPanels = document.querySelectorAll(".panel");
  const modalBackdrop = document.getElementById("modal-backdrop");

  // Application Elements
  const addAppBtn = document.getElementById("add-app-btn");
  const addAppModal = document.getElementById("add-app-modal");
  const addAppForm = document.getElementById("add-app-form");
  const appTableBody = document.getElementById("app-table-body");
  const appCountEl = document.getElementById("app-count");
  const appProgressEl = document.getElementById("app-progress");

  // LeetCode Elements
  const addLcBtn = document.getElementById("add-lc-btn");
  const addLcModal = document.getElementById("add-lc-modal");
  const addLcForm = document.getElementById("add-lc-form");
  const lcProblemsList = document.getElementById("lc-problems-list");
  let lcChart;

  // Outreach Elements
  const addOutreachBtn = document.getElementById("add-outreach-btn");
  const addOutreachModal = document.getElementById("add-outreach-modal");
  const addOutreachForm = document.getElementById("add-outreach-form");
  const outreachTableBody = document.getElementById("outreach-table-body");
  const outreachCountEl = document.getElementById("outreach-count");
  const outreachProgressEl = document.getElementById("outreach-progress");

  // Learning Elements
  const skillInput = document.getElementById("skill-input");
  const goalInput = document.getElementById("goal-input");
  const learningCheckboxes = document.querySelectorAll(".learning-checkbox");
  const learningProgressEl = document.getElementById("learning-progress");

  // Navigation Logic
  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const targetPanelId = e.target.dataset.target + "-panel";

      mainNav
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.remove("nav-item-active"));
      e.target.classList.add("nav-item-active");

      contentPanels.forEach((panel) => {
        panel.classList.add("hidden");
        if (panel.id === targetPanelId) {
          panel.classList.remove("hidden");
        }
      });
    }
  });

  // Modal Logic
  function openModal(modal) {
    modalBackdrop.classList.remove("hidden");
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modalBackdrop.classList.add("hidden");
    modalBackdrop
      .querySelectorAll(".bg-white")
      .forEach((modal) => modal.classList.add("hidden"));
  }

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop || e.target.closest(".modal-close-btn")) {
      closeModal();
    }
  });

  // Application Logic
  addAppBtn.addEventListener("click", () => openModal(addAppModal));

  addAppForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newApp = {
      id: Date.now(),
      date: document.getElementById("app-date").value,
      company: document.getElementById("app-company").value,
      position: document.getElementById("app-position").value,
      link: document.getElementById("app-link").value,
      status: "Applied",
    };
    applications.push(newApp);
    renderApplications();
    addAppForm.reset();
    closeModal();
  });

  function formatUrl(url) {
    if (!url) return "";
    // If the URL doesn't start with a protocol, add https://
    if (!url.match(/^https?:\/\//i)) {
      return "https://" + url;
    }
    return url;
  }

  function renderApplications() {
    appTableBody.innerHTML = "";
    applications.forEach((app) => {
      const row = document.createElement("tr");
      row.className = "border-b hover:bg-slate-50";
      const formattedLink = formatUrl(app.link);
      const linkCell = app.link
        ? `<a href="${formattedLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">View</a>`
        : "";
      row.innerHTML = `
                <td class="p-3 text-sm">${app.date}</td>
                <td class="p-3 font-medium">${app.company}</td>
                <td class="p-3 text-slate-600">${app.position}</td>
                <td class="p-3">
                    <select data-id="${
                      app.id
                    }" class="status-select bg-slate-200 text-slate-800 text-xs font-semibold p-1 rounded-md">
                        <option value="Applied" ${
                          app.status === "Applied" ? "selected" : ""
                        }>Applied</option>
                        <option value="Interview" ${
                          app.status === "Interview" ? "selected" : ""
                        }>Interview</option>
                        <option value="Offer" ${
                          app.status === "Offer" ? "selected" : ""
                        }>Offer</option>
                        <option value="Rejected" ${
                          app.status === "Rejected" ? "selected" : ""
                        }>Rejected</option>
                    </select>
                </td>
                <td class="p-3 text-sm">${linkCell}</td>
            `;
      appTableBody.appendChild(row);
    });

    appCountEl.textContent = applications.length;
    const progress = Math.min((applications.length / 10) * 100, 100);
    appProgressEl.style.width = `${progress}%`;

    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const appId = parseInt(e.target.dataset.id);
        const newStatus = e.target.value;
        const appToUpdate = applications.find((a) => a.id === appId);
        if (appToUpdate) {
          appToUpdate.status = newStatus;
        }
      });
    });
  }

  // LeetCode Logic
  addLcBtn.addEventListener("click", () => openModal(addLcModal));

  addLcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProblem = {
      id: Date.now(),
      date: document.getElementById("lc-date").value,
      name: document.getElementById("lc-name").value,
      difficulty: document.getElementById("lc-difficulty").value,
    };
    leetcodeProblems.push(newProblem);
    renderLeetCode();
    addLcForm.reset();
    closeModal();
  });

  function renderLeetCode() {
    updateLeetCodeChart();

    lcProblemsList.innerHTML = "";
    const groupedByDate = leetcodeProblems.reduce((acc, prob) => {
      (acc[prob.date] = acc[prob.date] || []).push(prob);
      return acc;
    }, {});

    Object.keys(groupedByDate)
      .sort()
      .reverse()
      .forEach((date) => {
        const dateHeader = document.createElement("p");
        dateHeader.className = "font-semibold mt-2";
        dateHeader.textContent = new Date(
          date + "T00:00:00"
        ).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        lcProblemsList.appendChild(dateHeader);

        groupedByDate[date].forEach((prob) => {
          const item = document.createElement("div");
          item.className = "pl-4";
          item.textContent = `${prob.name} (${prob.difficulty})`;
          lcProblemsList.appendChild(item);
        });
      });
  }

  function updateLeetCodeChart() {
    const problemCounts = leetcodeProblems.reduce((acc, problem) => {
      const day = new Date(problem.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      if (!acc[day]) acc[day] = { Easy: 0, Medium: 0, Hard: 0 };
      acc[day][problem.difficulty]++;
      return acc;
    }, {});

    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const easyData = labels.map((day) =>
      problemCounts[day] ? problemCounts[day].Easy : 0
    );
    const mediumData = labels.map((day) =>
      problemCounts[day] ? problemCounts[day].Medium : 0
    );
    const hardData = labels.map((day) =>
      problemCounts[day] ? problemCounts[day].Hard : 0
    );

    if (lcChart) {
      lcChart.data.datasets[0].data = easyData;
      lcChart.data.datasets[1].data = mediumData;
      lcChart.data.datasets[2].data = hardData;
      lcChart.update();
    } else {
      const ctx = document.getElementById("leetcode-chart").getContext("2d");
      lcChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            { label: "Easy", data: easyData, backgroundColor: "#34d399" },
            { label: "Medium", data: mediumData, backgroundColor: "#fbbf24" },
            { label: "Hard", data: hardData, backgroundColor: "#f87171" },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
          },
          plugins: {
            title: { display: true, text: "Weekly Problem Solving" },
          },
        },
      });
    }
  }

  // Outreach Logic
  addOutreachBtn.addEventListener("click", () => openModal(addOutreachModal));

  addOutreachForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newOutreach = {
      id: Date.now(),
      date: document.getElementById("outreach-date").value,
      contact: document.getElementById("outreach-contact").value,
      company: document.getElementById("outreach-company").value,
      platform: document.getElementById("outreach-platform").value,
      replied: false,
    };
    outreachs.push(newOutreach);
    renderOutreachs();
    addOutreachForm.reset();
    closeModal();
  });

  function renderOutreachs() {
    outreachTableBody.innerHTML = "";
    outreachs.forEach((outreach) => {
      const row = document.createElement("tr");
      row.className = "border-b hover:bg-slate-50";
      row.innerHTML = `
                <td class="p-3 text-sm">${outreach.date}</td>
                <td class="p-3 font-medium">${outreach.contact}</td>
                <td class="p-3 text-slate-600">${outreach.company}</td>
                <td class="p-3 text-slate-600">${outreach.platform}</td>
                <td class="p-3"><input type="checkbox" data-id="${
                  outreach.id
                }" class="reply-checkbox h-4 w-4" ${
        outreach.replied ? "checked" : ""
      }></td>
            `;
      outreachTableBody.appendChild(row);
    });

    outreachCountEl.textContent = outreachs.length;
    const progress = Math.min((outreachs.length / 5) * 100, 100);
    outreachProgressEl.style.width = `${progress}%`;

    document.querySelectorAll(".reply-checkbox").forEach((box) => {
      box.addEventListener("change", (e) => {
        const outreachId = parseInt(e.target.dataset.id);
        const outreachToUpdate = outreachs.find((o) => o.id === outreachId);
        if (outreachToUpdate) outreachToUpdate.replied = e.target.checked;
      });
    });
  }

  // Learning Logic
  skillInput.addEventListener(
    "input",
    (e) => (learningState.skill = e.target.value)
  );
  goalInput.addEventListener(
    "input",
    (e) => (learningState.goal = e.target.value)
  );
  learningCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", (e) => {
      learningState.progress[index] = e.target.checked;
      renderLearningProgress();
    });
  });

  function renderLearningProgress() {
    const checkedCount = learningState.progress.filter(Boolean).length;
    const totalCount = learningState.progress.length;
    const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
    learningProgressEl.style.width = `${progress}%`;
  }

  // Problem Form Logic
  document
    .getElementById("problem-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form values
      const problemName = document.getElementById("problem-name").value;
      const problemDate = document.getElementById("problem-date").value;
      const problemDescription = document.getElementById(
        "problem-description"
      ).value;
      const problemLink = document.getElementById("problem-link").value;

      // Validate mandatory fields
      if (!problemName || !problemDate) {
        alert("Problem Name and Date are mandatory!");
        return;
      }

      // Create a new row for the table
      const tableBody = document
        .getElementById("problem-table")
        .querySelector("tbody");
      const newRow = document.createElement("tr");

      newRow.innerHTML = `
      <td>${problemName}</td>
      <td>${problemDate}</td>
      <td>${problemDescription || ""}</td>
      <td>${
        problemLink ? `<a href="${problemLink}" target="_blank">Link</a>` : ""
      }</td>
    `;

      // Append the new row to the table
      tableBody.appendChild(newRow);

      // Clear the form
      document.getElementById("problem-form").reset();
    });

  // Initial Render
  renderApplications();
  renderLeetCode();
  renderOutreachs();
  renderLearningProgress();
});
