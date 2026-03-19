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

  this._selector = selector;

  this._opt = Object.assign(
    {
      classNameActive: "tab--active",
      remember: true,
      onChange: null,
    },
    option
  );

  this._originalHTML = this._container.innerHTML;

  this._searchParams = new URLSearchParams(location.search);

  this._init();

  this._handleTabClick(); // handle tab click
}

Switchy.prototype._init = function () {
  const valueOfTab = this._searchParams.get(
    this._sanitizeQueryParams(this._selector)
  );
  const tabActive =
    this._opt.remember && valueOfTab
      ? this._tabs.find(
          (tab) =>
            this._sanitizeQueryParams(tab.getAttribute("href")) === valueOfTab
        ) || this._tabs[0]
      : this._tabs[0];

  this._currentTab = tabActive;

  this._activateTab(tabActive, false);
};

Switchy.prototype._handleTabClick = function () {
  this._tabs.forEach((tab) => {
    tab.onclick = (e) => {
      e.preventDefault();
      this._checkActiveTab(tab);
    };
  }); // handle tab click
};

Switchy.prototype._activateTab = function (elementTab, triggerOnchange = true) {
  this._tabs.forEach((tab) => {
    if (tab.closest("li").classList.contains(this._opt.classNameActive)) {
      tab.closest("li").classList.remove(this._opt.classNameActive);
    }
  }); // remove all class tab--active

  elementTab.closest("li").classList.add(this._opt.classNameActive); // add class active
  this._panels.forEach((panel) => {
    panel.hidden = true;
  }); // hidden all panels

  const panelActive = document.querySelector(elementTab.getAttribute("href"));

  panelActive.hidden = false; // show panel

  // save tab reload
  if (this._opt.remember) {
    this._searchParams = new URLSearchParams(location.search);
    this._searchParams.set(
      this._sanitizeQueryParams(this._selector),
      this._sanitizeQueryParams(elementTab.getAttribute("href"))
    );
    history.replaceState(null, "", `?${this._searchParams}`);
  }

  // onChange
  if (typeof this._opt.onChange === "function" && triggerOnchange) {
    this._opt.onChange({
      tabActive: elementTab,
      panelActive,
    });
  }
};

Switchy.prototype.switch = function (input) {
  // input is  elementTab or selectorPanel
  let tabToActive = null;
  if (typeof input === "string") {
    tabToActive = this._tabs.find((tab) => tab.getAttribute("href") === input); // selector panel
    if (!tabToActive) {
      console.error(`${input} does not exits`);
      return;
    }
  } else if (this._tabs.includes(input)) {
    tabToActive = input; // element tab
  }

  if (!tabToActive) {
    console.error(`${input} does not exits`);
    return;
  }

  this._checkActiveTab(tabToActive);
};

Switchy.prototype.destroy = function () {
  this._container.innerHTML = this._originalHTML;
  this._panels.forEach((panel) => (panel.hidden = false)); // hidden all panels
  this._container = null;
  this._tabs = null;
  this._panels = null;
  this._currentTab = null;
  this._opt = null;
  this._searchParams = null;
  this._selector = null;
};

Switchy.prototype._checkActiveTab = function (tab) {
  if (this._currentTab !== tab) {
    this._activateTab(tab);
    this._currentTab = tab; // reset current tab
  }
};

Switchy.prototype._sanitizeQueryParams = function (string) {
  return string.replace(/[^a-zA-Z0-9]/g, "");
}; // sanitize query parameters url
