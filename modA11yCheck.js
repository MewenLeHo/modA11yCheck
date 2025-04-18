javascript: (function () {
  // Charger Chart.js
  const loadChartJs = () => {
    return new Promise((resolve, reject) => {
      if (window.Chart) {
        resolve(window.Chart);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = () => resolve(window.Chart);
      script.onerror = () => reject(new Error("Failed to load Chart.js"));
      document.head.appendChild(script);
    });
  };

  const modA11yCheck = {
    state: {
      tests: [],
      currentTest: 0,
      results: {
        automated: [],
        interactive: [],
        timeline: [],
      },
      startTime: new Date(),
    },

    async init() {
      try {
        await loadChartJs();
        this.createUI();
        this.initTests();
        this.bindEvents();
        this.startAutomatedTests();
      } catch (error) {
        console.error("Failed to initialize modA11yCheck:", error);
      }
    },

    createUI() {
      const container = document.createElement("div");
      container.id = "moda11y-check";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        z-index: 999999;
        font-family: system-ui;
        padding: 20px;
        max-height: 90vh;
        overflow-y: auto;
      `;

      container.innerHTML = `
        <style>
          #moda11y-check * { box-sizing: border-box; }
          .test-section { margin: 15px 0; }
          .test-item {
            padding: 10px;
            border: 1px solid #eee;
            margin: 5px 0;
            border-radius: 4px;
          }
          .pass { border-left: 4px solid #4caf50; }
          .fail { border-left: 4px solid #f44336; }
          .warning { border-left: 4px solid #ff9800; }
          .tab-content { display: none; }
          .tab-content.active { display: block; }
          .tabs {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
          }
          .tab {
            padding: 8px 16px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
          }
          .tab.active {
            border-bottom-color: #2196f3;
            color: #2196f3;
          }
          .chart-container {
            margin: 20px 0;
            height: 300px;
          }
          .interactive-test {
            background: #f5f5f5;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
          }
          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #2196f3;
            color: white;
            cursor: pointer;
          }
          .btn:hover { background: #1976d2; }
          .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            font-size: 20px;
            cursor: pointer;
          }
          @media (prefers-color-scheme: dark) {
            #moda11y-check {
              background: #1a1a1a;
              color: #fff;
            }
            .test-item { border-color: #333; }
            .interactive-test { background: #2d2d2d; }
          }
        </style>
        <div class="header">
          <h2>Moda11y Check</h2>
          <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="tabs">
          <div class="tab active" data-tab="tests">Tests</div>
          <div class="tab" data-tab="results">Results</div>
          <div class="tab" data-tab="charts">Charts</div>
        </div>
        <div id="content-tests" class="tab-content active">
          <div id="automated-tests"></div>
          <div id="interactive-tests"></div>
        </div>
        <div id="content-results" class="tab-content">
          <div id="test-summary"></div>
          <div id="test-details"></div>
        </div>
        <div id="content-charts" class="tab-content">
          <div class="chart-container">
            <canvas id="resultsChart"></canvas>
          </div>
          <div class="chart-container">
            <canvas id="timelineChart"></canvas>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      this.container = container;
    },
    initTests() {
      this.tests = {
        automated: [
          {
            name: "Dialog Role",
            category: "ARIA",
            test: () => {
              const modal = document.querySelector(
                '[role="dialog"], [role="alertdialog"]'
              );
              return {
                pass: !!modal,
                message: modal
                  ? "Dialog role correctly implemented"
                  : "No dialog role found",
                element: modal,
              };
            },
          },
          {
            name: "ARIA Modal",
            category: "ARIA",
            test: () => {
              const modal = document.querySelector('[aria-modal="true"]');
              return {
                pass: !!modal,
                message: modal
                  ? "aria-modal attribute present"
                  : "Missing aria-modal attribute",
                element: modal,
              };
            },
          },
          {
            name: "Focus Management",
            category: "Focus",
            test: () => {
              const modal = document.querySelector(
                '[role="dialog"], [role="alertdialog"]'
              );
              const focusableElements = modal?.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
              );
              return {
                pass: focusableElements?.length > 0,
                message: `Found ${
                  focusableElements?.length || 0
                } focusable elements`,
                element: modal,
              };
            },
          },
          {
            name: "Modal Labelling",
            category: "ARIA",
            test: () => {
              const modal = document.querySelector(
                '[role="dialog"], [role="alertdialog"]'
              );
              const hasLabel = modal?.hasAttribute("aria-label");
              const hasLabelledBy = modal?.hasAttribute("aria-labelledby");
              const labelledByElement =
                hasLabelledBy &&
                document.getElementById(modal.getAttribute("aria-labelledby"));

              return {
                pass: hasLabel || (hasLabelledBy && labelledByElement),
                message: hasLabel
                  ? "aria-label found"
                  : hasLabelledBy && labelledByElement
                  ? "aria-labelledby reference found"
                  : "Missing accessible name",
                element: modal,
              };
            },
          },
          {
            name: "Background Interaction",
            category: "Structure",
            test: () => {
              const modal = document.querySelector(
                '[role="dialog"][aria-modal="true"]'
              );
              const backdrop = document.querySelector(
                '.modal-backdrop, .overlay, [class*="backdrop"]'
              );
              const mainContent = document.querySelector(
                'main, #main, [role="main"]'
              );

              const checks = {
                pointerEvents:
                  backdrop &&
                  getComputedStyle(backdrop).pointerEvents === "none",
                inertAttribute: mainContent?.hasAttribute("inert"),
                ariaHidden: mainContent?.getAttribute("aria-hidden") === "true",
                focusTrap:
                  document.querySelector(
                    "[data-focus-trap], [data-focus-guard]"
                  ) !== null,
                tabIndex: Array.from(
                  mainContent?.querySelectorAll("a, button, input") || []
                ).some((el) => el.getAttribute("tabindex") === "-1"),
              };

              const results = Object.entries(checks).filter(
                ([, value]) => value
              );

              return {
                pass: results.length >= 2,
                message: results.length
                  ? `Background blocked using: ${results
                      .map(([key]) => key)
                      .join(", ")}`
                  : "No background interaction blocking found",
                details: checks,
                element: backdrop || mainContent,
              };
            },
          },
        ],
        interactive: [
          {
            name: "Keyboard Navigation",
            instructions: [
              "Press Tab key to navigate through modal",
              "Verify focus is trapped within modal",
              "Check if all interactive elements are reachable",
            ],
            verificationPoints: [
              "Focus stays within modal",
              "All interactive elements are reachable",
              "Focus order is logical",
            ],
          },
          {
            name: "Escape Key",
            instructions: [
              "Press Escape key while modal is open",
              "Verify modal closes",
              "Check if focus returns to trigger element",
            ],
            verificationPoints: [
              "Modal closes with Escape key",
              "Focus returns to previous element",
              "No keyboard traps remain",
            ],
          },
        ],
      };
    },

    async startAutomatedTests() {
      for (const test of this.tests.automated) {
        await this.runTest(test);
      }
      this.showInteractiveTests();
      this.updateCharts();
    },

    async runTest(test) {
      try {
        const startTime = performance.now();
        const result = await test.test();
        const duration = performance.now() - startTime;

        const testResult = {
          name: test.name,
          category: test.category,
          status: result.pass ? "pass" : "fail",
          message: result.message,
          duration,
          timestamp: new Date(),
        };

        this.state.results.automated.push(testResult);
        this.state.results.timeline.push({
          time: new Date(),
          test: test.name,
          duration,
        });

        this.updateTestUI(testResult);
      } catch (error) {
        console.error(`Test "${test.name}" failed:`, error);
      }
    },

    showInteractiveTests() {
      const container = this.container.querySelector("#interactive-tests");
      container.innerHTML = "<h3>Interactive Tests</h3>";

      this.tests.interactive.forEach((test, index) => {
        const testElement = document.createElement("div");
        testElement.className = "interactive-test";
        testElement.innerHTML = `
              <h4>${test.name}</h4>
              <div class="instructions">
                <h5>Instructions:</h5>
                <ul>${test.instructions
                  .map((i) => `<li>${i}</li>`)
                  .join("")}</ul>
              </div>
              <div class="verification">
                <h5>Verification Points:</h5>
                <ul>${test.verificationPoints
                  .map(
                    (p) => `
                  <li>
                    <input type="checkbox" id="check-${index}-${p.replace(
                      /\s/g,
                      ""
                    )}" />
                    <label for="check-${index}-${p.replace(
                      /\s/g,
                      ""
                    )}">${p}</label>
                  </li>
                `
                  )
                  .join("")}</ul>
              </div>
            `;
        container.appendChild(testElement);
      });
    },

    updateTestUI(result) {
      const testsContainer = this.container.querySelector("#automated-tests");
      const testElement = document.createElement("div");
      testElement.className = `test-item ${result.status}`;
      testElement.innerHTML = `
            <h4>${result.name}</h4>
            <p>${result.message}</p>
            <small>Duration: ${result.duration.toFixed(2)}ms</small>
          `;
      testsContainer.appendChild(testElement);
    },

    updateCharts() {
      this.createResultsChart();
      this.createTimelineChart();
    },

    createResultsChart() {
      const results = this.state.results.automated;
      const ctx = this.container
        .querySelector("#resultsChart")
        .getContext("2d");

      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Passed", "Failed", "Warnings"],
          datasets: [
            {
              data: [
                results.filter((r) => r.status === "pass").length,
                results.filter((r) => r.status === "fail").length,
                results.filter((r) => r.status === "warning").length,
              ],
              backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Test Results Overview",
            },
          },
        },
      });
    },

    createTimelineChart() {
      const ctx = this.container
        .querySelector("#timelineChart")
        .getContext("2d");
      const timeline = this.state.results.timeline;

      new Chart(ctx, {
        type: "line",
        data: {
          labels: timeline.map((t) => t.test),
          datasets: [
            {
              label: "Test Duration (ms)",
              data: timeline.map((t) => t.duration),
              borderColor: "#2196f3",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Test Execution Timeline",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Duration (ms)",
              },
            },
          },
        },
      });
    },

    generateReport() {
      const results = this.state.results;
      const summary = {
        total: results.automated.length,
        passed: results.automated.filter((r) => r.status === "pass").length,
        failed: results.automated.filter((r) => r.status === "fail").length,
        warnings: results.automated.filter((r) => r.status === "warning")
          .length,
        duration: new Date() - this.state.startTime,
      };

      return `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Modal Accessibility Test Report</title>
              <style>
                body { font-family: system-ui; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
                .test-item { margin: 10px 0; padding: 10px; border-radius: 4px; }
                .pass { background: #e8f5e9; border-left: 4px solid #4caf50; }
                .fail { background: #ffebee; border-left: 4px solid #f44336; }
                .warning { background: #fff3e0; border-left: 4px solid #ff9800; }
              </style>
            </head>
            <body>
              <h1>Modal Accessibility Test Report</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>

              <h2>Summary</h2>
              <ul>
                <li>Total Tests: ${summary.total}</li>
                <li>Passed: ${summary.passed}</li>
                <li>Failed: ${summary.failed}</li>
                <li>Warnings: ${summary.warnings}</li>
                <li>Duration: ${(summary.duration / 1000).toFixed(2)}s</li>
              </ul>

              <h2>Detailed Results</h2>
              ${results.automated
                .map(
                  (test) => `
                <div class="test-item ${test.status}">
                  <h3>${test.name}</h3>
                  <p>${test.message}</p>
                  <small>Category: ${test.category}</small>
                </div>
              `
                )
                .join("")}
            </body>
            </html>
          `;
    },

    exportReport() {
      const report = this.generateReport();
      const blob = new Blob([report], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modal-accessibility-report.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    bindEvents() {
      this.container.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          const tabName = tab.dataset.tab;
          this.container
            .querySelectorAll(".tab")
            .forEach((t) => t.classList.remove("active"));
          this.container
            .querySelectorAll(".tab-content")
            .forEach((c) => c.classList.remove("active"));
          tab.classList.add("active");
          this.container
            .querySelector(`#content-${tabName}`)
            .classList.add("active");
        });
      });

      const exportBtn = document.createElement("button");
      exportBtn.className = "btn";
      exportBtn.textContent = "Export Report";
      exportBtn.onclick = () => this.exportReport();
      this.container.appendChild(exportBtn);
    },
  };

  // Initialize the checker
  modA11yCheck.init();
})();
