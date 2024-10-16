class TableWidget {
    /** Creates tableWidget object.
     *  tWidget is refence to table html element
     *  fWidget is reference to filter input html element
     */
    constructor(tWidget, fWidget) {
        this.table = tWidget;
        this.filter = fWidget;
    }

    /** Creates row for the table. */
    _createRow(id, name) {
        let row = document.createElement("tr");
        row.classList.add("row");
        row.setAttribute('data-id', id);
        row.style.display = "block";
        row.style.maxHeight = "21px";

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

        let cell = document.createElement("td");
        cell.textContent = name;
        cell.style.maxHeight = "19px";
        cell.style.float = "left";
        cell.style.pointerEvents = "none";

        row.appendChild(cell);

        const button = document.createElement("button");
        button.classList.add("centered-button");
        button.style.maxHeight = "18px";
        button.style.height = "18px";
        button.style.marginTop = "1px";
        button.style.marginRight = "2px";
        button.style.paddingLeft = "5px";
        button.style.float = "right";
        button.style.pointerEvents = "none";

        row.appendChild(button);

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
        const filterValues = filterValue.split(",").map(item => item.trim());;
            
        for (let row of this.table.rows) {
            const nameCell = row.getElementsByTagName('td')[0];
            const nameText = nameCell.textContent;
    
            row.style.display = "none";
            for (let i = 0; i < filterValues.length; i++) {
                if (nameText.includes(filterValues[i])) {
                    row.style.display = "";
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
            if (((deselect == null && !row.classList.contains("selected")) || (deselect != null && !deselect))
                    && row.style.display != "none") {
                row.classList.add("selected");
            } else {
                row.classList.remove("selected");
            }
        }
    };
}