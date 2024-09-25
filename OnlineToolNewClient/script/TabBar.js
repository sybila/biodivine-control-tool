let TabBar = {
    // Contains elements for tab-bar-menu in the form { button:...., tabMenu: ...., tabTable:.... }
	_tabBarElements: undefined,
    //Dict containing all tabs {TABID: tab}
	_tabs: undefined,
    //ID of now active tab
	_nowActiveTab: undefined,
    //ID of the next created tab
	_tabId: undefined,
    _draggedRow: undefined,

    init() {
        this._tabBarElements = {"button": null,
            "tabMenu": document.getElementById("tab-bar"),
            "tabTable": document.getElementById("tab-table").getElementsByTagName("tbody")[0]};

        this._draggedRow = null;
        this._tabs = {};
        this._tabId = 1;
        this._nowActiveTab = window.initialTabInfo.type == "model" ? 0 : 1;

        if (window.initialTabInfo.type == "tree-explorer") {
            UI.openTreeExplorer();
        } else {
            this.addTab(window.initialTabInfo.type, JSON.parse(window.initialTabInfo.data));
        }
        
    },

    //Adds new tab into TabBar.
    addTab(type, data) {
        const tabRow = document.createElement("tr");
        const tabDiv = document.createElement("div");
        const tabId = type == "model" ? 0 : this._tabId++;

        tabRow.setAttribute("tabId", tabId);
        tabRow.setAttribute('draggable', 'true');

        tabDiv.classList.add("centered-button");
        tabDiv.style.width = "90%";
        tabDiv.style.height = "25px";
        tabDiv.style.textAlign = "center";
        tabDiv.style.paddingTop = "4px";
        tabDiv.style.marginTop = "5px";
        tabDiv.style.pointerEvents = "none";
        tabDiv.innerText = type + " " + window.modelId;
        this._tabs[tabId] = new Tab(type, data, tabDiv);
        
        tabRow.addEventListener("click", (e) => {
            this.toggleActive(e.target.getAttribute("tabId"), true);
        })

        tabRow.addEventListener('dragstart', () => {
            this._draggedRow = tabRow;
            tabRow.classList.add('dragging');
        });

        tabRow.addEventListener('dragover', (e) => {
            e.preventDefault();

            const rows = Array.from(this._tabBarElements.tabTable.rows);
            if (rows.indexOf(e.target) > rows.indexOf(this._draggedRow)) {
                e.target.after(this._draggedRow);
            } else {
                e.target.before(this._draggedRow);
            }
        })

        tabRow.addEventListener('dragend', () => {
            this._draggedRow = null;
            tabRow.classList.remove('dragging');
        });
        
        this.toggleActive(tabId, false);
        tabRow.appendChild(tabDiv);
        this._tabBarElements.tabTable.appendChild(tabRow);
    },

    //Changes active tab from this._tabs[this._nowActiveTab] to this._tabs[newActiveId]
    toggleActive(newActiveId, returnEqual) {
        if (newActiveId == null) {
            return;
        }

        if (this._nowActiveTab != newActiveId) {
            const oldTab = this._tabs[this._nowActiveTab];
            oldTab.changeStatus();
    
            if (oldTab.type == "model") {
                oldTab.data = LiveModel.exportAeon(true);
            }
        } else if (returnEqual) {
            return;
        }
        
        const newTab = this._tabs[newActiveId];
        newTab.changeStatus();
        UI.toggleDiv(newTab.type, newTab.data);
        this._nowActiveTab = newActiveId;
    },

    //Close current tab.
    closeTab() {
        const tabs =  Array.from(this._tabBarElements.tabTable.rows);

        if (tabs.length < 2) {
            return;
        }

        let switchToIndex = null;
        let deleteIndex = null;

        for (let i = 0; i < tabs.length; i++) {
            if (deleteIndex != null && switchToIndex != null) {
                switchToIndex = i;
                break;
            }

            if (tabs[i].getAttribute("tabId") == this._nowActiveTab) {
                deleteIndex = i;
            } else {
                switchToIndex = i;
            }
        }

        this.toggleActive(tabs[switchToIndex].getAttribute("tabId"), true);
        delete this._tabs[tabs[deleteIndex].getAttribute("tabId")];
        this._tabBarElements.tabTable.deleteRow(deleteIndex);
    },

    //Closes all tabs except the one with the model.
    closeResults() {
        const tabs =  Array.from(this._tabBarElements.tabTable.rows);

        for (let i = tabs.length - 1; i >= 0; i--) {
            if (tabs[i].getAttribute("tabId") != this._nowActiveTab) {
                delete this._tabs[tabs[i].getAttribute("tabId")];
                this._tabBarElements.tabTable.deleteRow(i);
            }
        }
    },

    openModel() {
        const resTab = TabBar.getTab(TabBar.getNowActiveId());
        const modelTab = TabBar.getTab(0);

        if (modelTab == undefined) {
            TabBar.addTab("model", LiveModel.modelSave);
        } else {
            TabBar.toggleActive(0, false);
        }
    },

    getTab(tabId) {
        return this._tabs[tabId];
    },

    getNumberOfTabs() {
        return Object.keys(this._tabs).length;
    },

    getNowActiveId() {
        return this._nowActiveTab;
    }
}