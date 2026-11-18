function mountAppleShellElements() {
    // Auto-collapse Your Library to icon-only mode when 68px Apple Rail is enabled
    if (state.appleRail68) {
      const collapseBtn = document.querySelector('button[aria-label="Collapse Your Library"]');
      if (collapseBtn) collapseBtn.click();
    }

    const navBar = document.querySelector(".Root__nav-bar");
    if (navBar) {
      if (!document.getElementById("cadence-apple-rail-logo")) {
        const logoBtn = document.createElement("div");
        logoBtn.id = "cadence-apple-rail-logo";
        logoBtn.title = "Cadence Studio (Alt+C)";
        logoBtn.innerHTML = `<svg width="20" height="24" viewBox="0 0 170 170" fill="currentColor"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.13-1.9-14.34-6.08-3.69-3.03-7.61-7.82-11.77-14.37-5.14-8.01-9.36-17.28-12.66-27.82-3.3-10.54-4.95-20.69-4.95-30.45 0-11.29 2.82-20.51 8.46-27.67 5.64-7.16 12.72-10.83 21.24-11.01 4.81 0 10.18 1.38 16.12 4.14 5.93 2.76 9.75 4.18 11.46 4.26 1.34 0 5.56-1.63 12.66-4.88 7.1-3.25 13.11-4.65 18.03-4.21 13.48 1.09 23.62 6.42 30.42 15.99-12.08 7.32-18.02 17.54-17.81 30.65.21 10.21 3.98 18.71 11.31 25.5 5.14 4.82 11.17 7.82 18.09 9-1.45 4.35-3.08 8.53-4.92 12.56zM119.22 31.9c0 7.99-2.92 15.46-8.76 22.39-7.04 8.21-15.56 12.95-24.81 12.2-.15-.97-.23-2-.23-3.09 0-7.66 3.34-15.86 9.33-22.64 2.98-3.42 6.77-6.26 11.37-8.52 4.6-2.25 8.95-3.49 13.06-3.71.03 1.15.04 2.27.04 3.37z"/></svg>`;
        logoBtn.addEventListener("click", toggleCadenceModal);
        navBar.prepend(logoBtn);
      }

      if (!document.getElementById("cadence-rail-bookmark-btn")) {
        const bookmarkBtn = document.createElement("button");
        bookmarkBtn.id = "cadence-rail-bookmark-btn";
        bookmarkBtn.title = "Liked Songs";
        bookmarkBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v12.085a.5.5 0 0 1-.812.39L8 11.64l-4.188 3.335A.5.5 0 0 1 3 14.585V2.5z"/></svg>`;
        bookmarkBtn.addEventListener("click", () => {
          Spicetify.Platform?.History?.push("/collection/tracks");
        });
        navBar.appendChild(bookmarkBtn);
      }
    }

    // Mount inside the inner panel container (not Root__right-sidebar directly) so it stays horizontal
    const queueInnerPanel =
      document.querySelector(".Root__right-sidebar aside") ||
      document.querySelector(".Root__right-sidebar .main-nowPlayingView-content") ||
      document.querySelector(".Root__right-sidebar > div:last-child");

    if (queueInnerPanel && !document.getElementById("cadence-queue-segmented-tabs")) {
      const tabBar = document.createElement("div");
      tabBar.id = "cadence-queue-segmented-tabs";
      tabBar.innerHTML = `
        <button class="cadence-seg-tab active" data-qtab="next">Playing next</button>
        <button class="cadence-seg-tab" data-qtab="history">History</button>
      `;
      tabBar.querySelectorAll(".cadence-seg-tab").forEach((btn) => {
        btn.addEventListener("click", () => {
          tabBar.querySelectorAll(".cadence-seg-tab").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const nativeTabs = queueInnerPanel.querySelectorAll('[role="tab"]');
          if (btn.dataset.qtab === "history" && nativeTabs[1]) nativeTabs[1].click();
          else if (nativeTabs[0]) nativeTabs[0].click();
        });
      });
      queueInnerPanel.prepend(tabBar);
    }
  }
