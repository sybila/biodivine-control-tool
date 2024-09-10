let TabBar = {
    // Contains elements for tab-bar-menu in the form { button:...., tabMenu: ...., tabTable:.... }
	_tabBarElements: undefined,
	_tabs: undefined,
	nowActiveTab: undefined,
	_tabId: undefined,
    _draggedRow: undefined,

    init(initialTabInfo) {
        this._tabBarElements = {"button":null,
            "tabMenu":document.getElementById("tab-bar"),
            "tabTable":document.getElementById("tab-table").getElementsByTagName("tbody")[0]};

        this._draggedRow = null;
        this._tabs = {};
        this._tabId = 0;
        this._nowActiveTab = 0;

        if (initialTabInfo == null) {
            this.addTab("model", LiveModel.exportAeon(true));
        } else {
            this.addTab(initialTabInfo.type, initialTabInfo.data);
        }
    },

    addTab(type, data) {
        const tabRow = document.createElement("tr");
        const tabDiv = document.createElement("div");

        tabRow.setAttribute("tabId", this._tabId);
        tabRow.setAttribute('draggable', 'true');

        tabDiv.classList.add("centered-button");
        tabDiv.style.width = "90%";
        tabDiv.style.height = "25px";
        tabDiv.style.textAlign = "center";
        tabDiv.style.paddingTop = "4px";
        tabDiv.style.marginTop = "5px";
        tabDiv.style.pointerEvents = "none";
        tabDiv.innerText = type + " " + this._tabId;
        this._tabs[this._tabId] = new Tab(this._tabId, type, data, tabDiv);
        
        tabRow.addEventListener("click", (e) => {
            this.toggleActive(e.target.getAttribute("tabId"), true);
        })

        tabRow.addEventListener('dragstart', (e) => {
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
        
        this.toggleActive(this._tabId, false);
        this._tabId += 1;

        tabRow.appendChild(tabDiv);
        this._tabBarElements.tabTable.appendChild(tabRow);
    },

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
        UI.toggleDiv(newTab.type == "model", newTab.data);
        this._nowActiveTab = newActiveId;
    },

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

    getTab(tabId) {
        return this._tabs[tabId];
    },

    getNowActiveId() {
        return this._nowActiveTab;
    }
}