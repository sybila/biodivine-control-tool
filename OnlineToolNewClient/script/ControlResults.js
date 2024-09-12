let ControlResults = {
    _perturbTable: undefined,

    // Saves all filter inputs into one array. ([0] = perturbation, [1] = maximal size,
    //                                            [2] = minimal number of parametrizations, [3] = minimal robustness)
    _filters: undefined,
    _filterMenu: undefined,
    _sortMode: undefined,
    _orderArrows: undefined,

    init() {
        this._perturbTable = document.getElementById("ControlResults").getElementsByTagName("tbody")[0];
        this._filters = document.getElementsByClassName("filterInput");
        this._sortMode = [document.getElementById("primary-sort-switch"), document.getElementById("secondary-sort-switch")];
        this._orderArrows = document.getElementsByClassName("arrow");
        this._filterMenu = document.getElementById("control-res-filters");
    },

    _changeContentMode(contentDiv) {
        if (contentDiv.getAttribute("clickShown") == "true") {
            contentDiv.innerHTML = contentDiv.getAttribute("cont");
            contentDiv.setAttribute("clickShown", false);
        } else {
            contentDiv.innerHTML = contentDiv.getAttribute("clickCont");
            contentDiv.setAttribute("clickShown", true);
        }
    },

    insertData(controlData) {
        this._perturbTable.innerHTML = "";
        document.getElementById("ParamNumberStat").textContent = controlData.parNum;
        document.getElementById("PertNumberStat").textContent = controlData.perturbations.length;
        document.getElementById("MinSizeStat").textContent = 0;
        document.getElementById("MaxRobStat").textContent = 0;
        document.getElementById("OscillationStat").textContent = controlData.oscillation;
        document.getElementById("PhenotypeStat").innerHTML = this._createColouredVars(this._createPertDict(controlData.phenotype));
        document.getElementById("ControllableStat").textContent = controlData.controllable;
        this._fillTable(controlData.perturbations);
    },

    // Creates and appends cell into the row of the table.
    // If click1content is not null, then the content and click content is switched on the click on the cell.
    _appendCell(row, content, clickContent, width) {
        const cell = document.createElement("td");
        
        cell.style.minWidth = width;
        cell.style.maxWidth = width;
        cell.style.overflow = "hidden";
        cell.style.borderStyle = "solid";
        cell.style.borderWidth = "1px 1px 0px 1px";

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("table-div");
        contentDiv.innerHTML = content;

        if (clickContent != null) {
            contentDiv.setAttribute("cont", content);
            contentDiv.setAttribute("clickCont", clickContent);
            contentDiv.setAttribute("clickShown", false);

            cell.addEventListener("click", () => {
                this._changeContentMode(contentDiv);
            })
        }

        cell.appendChild(contentDiv);
        row.appendChild(cell);
    },

    // Creates string of variables coloured by their phenotype/perturbation value.
    _createColouredVars(variables) {
        let resultStr = "";

        for (const variable in variables) {
            if (variables[variable] == "true") {
                resultStr += `<span style="color: green; line-height: 10px; white-space: nowrap;">${variable}</span>`
            } else {
                resultStr += `<span style="color: red; line-height: 10px; white-space: nowrap;">${variable}</span>`
            }

            resultStr += ", ";
        }
        return resultStr.substring(0, resultStr.length - 2);
    },

    // Creates dict from perturbarion in the form of array of strings [varName:pertValue, ...].
    // nullable (boolean) is true if pertValue may be undefined.
    _createPertDict(pert, nullable = true) {
        const pertDict = {};

        for (const variable of pert) {
            const varSplit = variable.split(":");
            varSplit[0] = varSplit[0].trim();

            if (nullable && varSplit.length < 2) {
                pertDict[varSplit[0]] = null;
            } else {
                pertDict[varSplit[0]] = varSplit[1];
            }
        }

        return pertDict;
    },

    // Fills table with perturbations and data about them.
    _fillTable(perts) {
        let id = 1;

        for (const pert of perts) {
            const row = document.createElement("tr");

            const pertDict = this._createPertDict(pert[0], false);

            row.style.overflow = "hidden";

            row.setAttribute('data-id', id);
            row.setAttribute('perturb', JSON.stringify(pertDict));

            this._appendCell(row, id, null, "70px");
            this._appendCell(row, this._createColouredVars(pertDict), pert[0], "877px");
            this._appendCell(row, pert[0].length, null, "70px");
            this._appendCell(row, pert[1], null, "190px");
            this._appendCell(row, pert[2], null, "107px");

            this._perturbTable.appendChild(row);

            id += 1;
        };
    },

    // Converts number in the form of string into integer. Returns undefined if stringNum is empty or not a number.
    _convertToNumber(stringNum) {
        const num = Number(stringNum);

        return stringNum == "" || isNaN(num) || !isFinite(num) ? undefined : num;
    },

    // Tests if perturbation includes variables.
    _includesPerts(perts, include) {
        for (const variable in include) {
            if (perts[variable] == undefined ||
                    (include[variable] != null && perts[variable] != include[variable])) {
                return false;
            }
        }

        return true;
    },

    // Filters data from the table depending on input of all filter inputs.
    filterTable() {
        const searchFilter = this._filters[0].value.split(",");
        const search = searchFilter.length > 0 && searchFilter[0] != "";
        const searchDict = this._createPertDict(searchFilter);

        const filterValues = [  searchDict, 
                                this._convertToNumber(this._filters[1].value), 
                                this._convertToNumber(this._filters[2].value),
                                this._convertToNumber(this._filters[3].value)];

        for (const row of this._perturbTable.rows) {
            const cells = row.getElementsByTagName('td');
            if (search && !this._includesPerts(JSON.parse(row.getAttribute('perturb')), filterValues[0]) ||
                    filterValues[1] < Number(cells[2].textContent) ||
                        filterValues[2] > Number(cells[3].textContent) ||
                            filterValues[3] > Number(cells[4].textContent)) {
                row.style.display = "none";
            } else {
                row.style.display = "";
            }
        };
    },

    // Comparator for the sorting function.
    // a + b are compared rows.
    // primaryIndex + secondaryIndex are indexes of cells by which the rows will be sorted.
    // orderLevelIndex determines if we are sorting by primary ordering parameters or secondary.
    _comparator(a, b, primaryIndex, secondaryIndex, orderLevelIndex) {
        if (a.getAttribute("data-id") == null) {
            return -1;
        } 

        if (b.getAttribute("data-id") == null) {
            return 1;
        }

        const result = a.getElementsByTagName('td')[primaryIndex].textContent
                         - b.getElementsByTagName('td')[primaryIndex].textContent;
        
        if (orderLevelIndex != 1 && result == 0) {
            return this._comparator(a, b, secondaryIndex, undefined, 1);
        }

        const reverseOrder = this._orderArrows[orderLevelIndex].classList.contains("down") ? -1 : 1;
        return reverseOrder * result;
    },

    // Returns index of cell in the table depending on the set sorting mode.
    // Sort index (int 0-1) determines if we want primary or secondary sorting mode.
    _getSortCellIndex(sortIndex) {
        if (this._sortMode[sortIndex].value == "ID") {
            return 0;
        } 
        
        if (this._sortMode[sortIndex].value == "Size") {
            return 2;
        }
        
        return 3;
    },

    // Sorts rows of the table by set sort modes and order.
    sortRows() {
        const primaryIndex = this._getSortCellIndex(0);
        const secondaryIndex = this._getSortCellIndex(1);

        const sortedRows = Array.from(this._perturbTable.rows)
                                .sort((a, b) => this._comparator(a, b, primaryIndex, secondaryIndex, 0));
        this._perturbTable.innerHTML = '';
        
        for (let row of sortedRows) {
            this._perturbTable.appendChild(row);
        }
    },

    pertVisual(e) {
        for (const row of this._perturbTable.rows) {
            const pertDiv = row.children[1].children[0];
            pertDiv.setAttribute("clickShown", e.getAttribute("colourShown"));
            this._changeContentMode(pertDiv);
            
        }

        e.setAttribute("colourShown", !(e.getAttribute("colourShown") == "true"));
    },

    // 
    switchSortMode(buttonID) {
        if (this._sortMode[buttonID].value == "ID") {
            this._sortMode[buttonID].value = "Size";
        } else if (this._sortMode[buttonID].value == "Size") {
            this._sortMode[buttonID].value = "NoP";
        } else {
            this._sortMode[buttonID].value = "ID";
        }

        if (this._sortMode[0].value == "ID" || this._sortMode[0].value == this._sortMode[1].value) {
            this._orderArrows[1].style.borderColor = "#808080";
        } else {
            this._orderArrows[1].style.borderColor = "#FCA101";
        }

        this.sortRows();
    },

    switchOrder(buttonID) {
        if (this._orderArrows[buttonID].classList.contains("down")) {
            this._orderArrows[buttonID].classList.remove("down");
            this._orderArrows[buttonID].classList.add("up");
        } else {
            this._orderArrows[buttonID].classList.remove("up");
            this._orderArrows[buttonID].classList.add("down");
        }

        this.sortRows();
    },

    showFilters() {
        this._filterMenu.style.display = this._filterMenu.style.display == "none" ? "" : "none";
    },

    openModel() {
        const resTab = TabBar.getTab(TabBar.getNowActiveId());
        const modelTab = TabBar.getTab(resTab.data.modelTabId);
        console.log(resTab.data.modelTabId);
        if (modelTab == undefined) {
            TabBar.addTab("model", resTab.data.model);
            resTab.data.modelTabId = TabBar.getNowActiveId();
        } else {
            TabBar.toggleActive(resTab.data.modelTabId, false);
        }
    }
}