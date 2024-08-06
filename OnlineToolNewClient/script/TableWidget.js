class TableWidget {
    constructor(tWidget, fWidget, cWidget) {
        this.table = tWidget;
        this.filter = fWidget;
        this.count = cWidget;
    }

    // Filters data from the table depending on the text input of the filter
    filterTable() { 
        const filterValue = this.filter.value;
            
        for (let row of this.table.rows) {
            const nameCell = row.getElementsByTagName('td')[0];
            const nameText = nameCell.textContent;
    
            row.style.display = nameText.includes(filterValue) ? "" : "none";
        };
    }

    // Renames variable coresponding to id.
    renameById(id, newName) {
        const row = this.table.querySelector(`tr[data-id='${id}']`)

        if (row) {
            const cell = row.getElementsByTagName('td')[0];
            cell.textContent = newName;
        }
    }

    // Delete variable by its id from table.
    removeFromTable(id) {
        const row = this.table.querySelector(`tr[data-id='${id}']`)
        this.table.removeChild(row);
        this.count.decrement();
    }

    // Creates draggable row for table.
    _createRow(id, name) {
        let row = document.createElement("tr");
        row.setAttribute('draggable', 'true');
        row.setAttribute('data-id', id);

        row.addEventListener('dragstart', () => {
            row.classList.add('dragging');
        });

        row.addEventListener('dragend', () => {
            row.classList.remove('dragging');
        });

        let cell = document.createElement("td");
        cell.textContent = name;
        row.appendChild(cell);

        return row;
    }

    // Add a variable to table determined by the controllability of the variable.
    addVariable(id, name) {
        this.table.appendChild(this._createRow(id, name));
        this.count.increment();
    }

    // Deletes all data from tables given in tables array.
    clear() {
        this.table.innerHTML = '';
        this.count.clear();
    }
}