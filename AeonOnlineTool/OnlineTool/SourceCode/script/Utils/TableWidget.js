class TableWidget {
    /** Creates tableWidget object.
     *  tWidget is refence to table html element
     *  fWidget is reference to filter input html element
     */
    constructor(tWidget, fWidget) {
        this.table = tWidget;
        this.filter = fWidget;
        this.filter.value = "";
    }

    /** Adds name on the end of the filter and filters this.table. */
    _addIntoFilter(name) {
        const filterValue = this.filter.value;
        const lastComma = filterValue.lastIndexOf(",");

        if (lastComma == undefined || lastComma == null || lastComma < 1) {
            this.filter.value = name;
        } else {
            this.filter.value = `${filterValue.slice(0, lastComma)}, ${name}`;
        }

        this.filter.value = this.filter.value.trim();
        this.filterTable();
    }

    /** Fills row with elements. */
    _addRowElements(row, name) {
        let cell = document.createElement("td");
        cell.textContent = name;
        cell.style.maxHeight = "19px";
        cell.style.float = "left";
        cell.style.pointerEvents = "none";

        row.appendChild(cell);

        const indicator = document.createElement("button");
        indicator.classList.add("centered-button");
        indicator.style.maxHeight = "18px";
        indicator.style.height = "18px";
        indicator.style.marginTop = "1px";
        indicator.style.marginRight = "2px";
        indicator.style.paddingLeft = "5px";
        indicator.style.float = "right";
        indicator.style.pointerEvents = "none";

        row.appendChild(indicator);

        const filterAdd = document.createElement("button");
        filterAdd.classList.add("centered-button");
        filterAdd.style.maxHeight = "18px";
        filterAdd.style.height = "18px";
        filterAdd.style.marginTop = "1px";
        filterAdd.style.marginRight = "2px";
        filterAdd.style.paddingLeft = "5px";
        filterAdd.style.float = "right";

        filterAdd.onclick = () => {
            row.classList.toggle("selected");
            this._addIntoFilter(name);
        };

        row.appendChild(filterAdd);
    };

    /** Creates row for the table. */
    _createRow(id, name) {
        let row = document.createElement("tr");
        row.classList.add("row");
        row.setAttribute('data-id', id);
        row.style.display = "block";
        row.style.maxHeight = "21px";
        row.style.zIndex = "50";

        // On mouseover, highlight/select rows if mouse is down
        row.addEventListener('mouseover', function (event) {
            event.preventDefault();

            if (UI.isMouseDown) {
                row.classList.toggle("selected");
            }            
        });

        row.addEventListener('mousedown', (event) => {
            event.preventDefault();
            UI.isMouseDown = true;
            row.classList.toggle("selected");
        })

        // On mouseup, stop selecting
        document.addEventListener('mouseup', function () {
            UI.isMouseDown = false;
        });

        this._addRowElements(row, name);

        return row;
    }

    /** Add a variable to table determined by the controllability of the variable. */
    addVariable(id, name) {
        this.table.appendChild(this._createRow(id, name));


    }

    /** Delete variable by its id from table. */
    removeFromTable(id) {
        const row = this.table.querySelector(`tr[data-id='${id}']`)
        this.table.removeChild(row);
    }



    /** Renames variable coresponding to id. */
    renameById(id, newName) {
        const row = this.table.querySelector(`tr[data-id='${id}']`)

        if (row) {
            const cell = row.getElementsByTagName('td')[0];
            cell.textContent = newName;
        }
    }

    /** Deletes all data from the table. */
    clear() {
        this.table.innerHTML = '';
    }

    /** Filters data from the table depending on the text input of the filter */
    filterTable() { 
        const filterValue = this.filter.value;
        const filterValues = filterValue.split(",").map(item => item.trim());

        //Should happen only if the last element of the filterValue variable is ',' 
        const showAll = filterValues.length < 1 || filterValues[filterValues.length - 1] == "";

        for (let row of this.table.rows) {
            const nameCell = row.getElementsByTagName('td')[0];
            const nameText = nameCell.textContent;

            row.style.display = "none";
            for (let includeText of filterValues) {
                if (showAll || nameText.includes(includeText)) {
                    row.style.display = "block";
                    break;
                }
            }
        };
    }

    /** Changes style.backgroundColor of the indicator in the row to the color defined by the color parameter. */
    changeIndicatorColor(id, color) {
        const row = this.table.querySelector(`tr[data-id='${id}']`)
        
        const button = row.getElementsByTagName("button")[0];
        button.style.backgroundColor = color;
    };

    /** Changes selected class of all rows.
     *  if deselect (nullable boolean) is true then selects all, if false deselects all,
     *  if null toggles selected status of all rows to the opposite value.
     */
    changeSelectedAll(deselect) {
        for (let row of this.table.rows) {
            if (row.style.display == "none") {
                continue;
            }

            if ((deselect == null && !row.classList.contains("selected")) || (deselect != null && !deselect)) {
                row.classList.add("selected");
            } else {
                row.classList.remove("selected");
            }
        }
    };
}