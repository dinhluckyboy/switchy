function Switchy(selector, option) {
  this._container = document.querySelector(selector); // set container tabs
  if (!this._container) {
    console.error(`${selector} not found`);
    return;
  } // check selector

  this._tabs = Array.from(this._container.querySelectorAll(" li a")); //  tabs list

  this._panels = this._tabs
    .map((tab) => {
      return document.querySelector(tab.getAttribute("href"));
    })
    .filter(Boolean); // panels list

  if (this._tabs.length !== this._panels.length) {
    console.error("Tabs and panels must have the same length.");
    return;
  } // check panel.length

  this._opt = Object.assign(
    {
      remember: true,
    },
    option
  );

  this._originalHTML = this._container.innerHTML;

  this._init();

  this._handleTabClick(); // handle tab click
}

Switchy.prototype._init = function () {
  //   const saveTab = location.hash;
  //   const tabActive = saveTab
  //     ? this._tabs.find((tab) => tab.getAttribute("href") === saveTab) ||
  //       this._tabs[0]
  //     : this._tabs[0];

  const saveTab = location.hash;
  const tabActive =
    this._opt.remember && saveTab
      ? this._tabs.find((tab) => tab.getAttribute("href") === saveTab) ||
        this._tabs[0]
      : this._tabs[0];

  this._activateTab(tabActive);
};

Switchy.prototype._handleTabClick = function () {
  this._tabs.forEach((tab) => {
    tab.onclick = (e) => {
      e.preventDefault();
      this._activateTab(tab);
    };
  }); // handle tab click
};

Switchy.prototype._activateTab = function (elementTab) {
  this._tabs.forEach((tab) => {
    if (tab.closest("li").classList.contains("tab--active")) {
      tab.closest("li").classList.remove("tab--active");
    }
  }); // remove all class tab--active
  elementTab.closest("li").classList.add("tab--active"); // add class active

  this._panels.forEach((panel) => {
    panel.hidden = true;
  }); // hidden all panels
  const panelActive = document.querySelector(elementTab.getAttribute("href"));
  panelActive.hidden = false; // show panel

  // save tab reload
  if (this._opt.remember) {
    history.replaceState(null, null, elementTab.getAttribute("href"));
  }
};

Switchy.prototype.switch = function (input) {
  // input is  elementTab or selectorPanel
  let tabToActive = null;
  if (typeof input === "string") {
    tabToActive = this._tabs.find((tab) => tab.getAttribute("href") === input);
    if (!tabToActive) {
      console.error(`${input} does not exits`);
      return;
    }
  } else if (this._tabs.includes(input)) {
    tabToActive = input;
  }

  if (!tabToActive) {
    console.error(`${input} does not exits`);
    return;
  }

  this._activateTab(tabToActive);
};

Switchy.prototype.destroy = function () {
  this._container.innerHTML = this._originalHTML;
  this._panels.forEach((panel) => (panel.hidden = false)); // hidden all panels
  this._container = null;
  this._tabs = null;
  this._panels = null;
};
