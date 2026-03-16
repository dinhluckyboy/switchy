function Switchy(selector) {
  const container = document.querySelector(selector); // set container tabs
  if (!container) {
    console.error(`${selector} not found`);
    return;
  } // check selector

  this._tabs = Array.from(container.querySelectorAll(" li a")); //  tabs list

  this._panels = this._tabs
    .map((tab) => {
      return this._getPanelActive(tab);
    })
    .filter(Boolean); // panels list

  if (this._tabs.length !== this._panels.length) {
    console.error("Tabs and panels must have the same length.");
    return;
  } // check panel.length

  this._init();

  this._handleTabClick(); // handle tab click
}

Switchy.prototype._init = function () {
  const tabActive = this._tabs[0]; // init tab active
  this._removeTabActive(); // remove all class tab--active
  this._activeTab(tabActive); // set tab-active

  const panelActive = this._panels[0]; // init panel active
  this._hiddenPanels(); // hidden all panels
  this._showPanel(panelActive); // show panel
};

Switchy.prototype._handleTabClick = function () {
  this._tabs.forEach((tab) => {
    tab.onclick = (e) => {
      e.preventDefault();

      this._removeTabActive();
      this._activeTab(tab);

      this._hiddenPanels();
      this._showPanel(this._getPanelActive(tab));
    };
  }); // handle tab click
};

Switchy.prototype._removeTabActive = function () {
  this._tabs.forEach((tab) => {
    if (tab.closest("li").classList.contains("tab--active")) {
      tab.closest("li").classList.remove("tab--active");
    }
  }); // remove all class tab--active
};

Switchy.prototype._hiddenPanels = function () {
  this._panels.forEach((panel) => {
    panel.hidden = true;
  }); // hidden all panels
};

Switchy.prototype._activeTab = function (elementTab) {
  elementTab.closest("li").classList.add("tab--active");
}; // add class tab-active

Switchy.prototype._showPanel = function (elementPanel) {
  elementPanel.hidden = false;
}; // show panel

Switchy.prototype._getPanelActive = function (elementTab) {
  return document.querySelector(elementTab.getAttribute("href"));
}; // get panel active for tab

Switchy.prototype.switch = function (input) {
  // input is  elementTab or selectorPanel
  if (typeof input === "string") {
    // selector panel
    const panelCurrent = document.querySelector(input);
    if (!this._panels.includes(panelCurrent)) {
      console.error(`${input} does not exits`);
      return;
    }
    this._hiddenPanels();
    panelCurrent.hidden = false;
  }

  //   console.log("handle...");
};

const tabs = new Switchy("#tabs");
