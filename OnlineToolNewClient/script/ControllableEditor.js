let ControllableEditor = {
    _contrTable: undefined,
    _uncontrTable: undefined,

    // Initialize the editor
    init() {
        var tableNow = document.getElementById("Controllable");
        this._contrTable = new TableWidget(tableNow.getElementsByTagName('tbody')[0],
                                    document.getElementById("ControllableFilter"),
                                    new CountWidget(document.getElementById("controllable-count"), 0));
        this.addDragAndDropHandlers(tableNow);

        tableNow = document.getElementById("Uncontrollable");
        this._uncontrTable = new TableWidget(tableNow.getElementsByTagName('tbody')[0],
                                    document.getElementById("UncontrollableFilter"),
                                    new CountWidget(document.getElementById("uncontrollable-count"), 0));
        this.addDragAndDropHandlers(tableNow);
    },

    // Returns table in relation to the isControllable parameter.
    // If isControllable is true returns controllable table else returns uncotrollable table.
    _getTable(isControllable) {
        return isControllable ? this._contrTable : this._uncontrTable;
    },

    // Add a variable to table determined by the controllability of the variable.
    addVariable(id, name, controllable) {
        const table = this._getTable(controllable);
        table.addVariable(id, name);
    },

    // Renames variable in the Controllable editor.
    renameVariable(id, newName) {
        const table = this._getTable(LiveModel.variableFromId(id).controllable);
        table.renameById(id, newName);
    },

    // Delete variable by its id from Controllable editor.
    removeVariable(id) {
        const table = this._getTable(LiveModel.variableFromId(id).controllable);
        table.removeFromTable(id);
    },

    // Delete all rows from both tables
    clear() {
        this._contrTable.clear();
        this._uncontrTable.clear();
    },

    // Filters data from table chosen by the isControllable variable.
    filterTable(isControllable) {
        const table = this._getTable(isControllable);
        table.filterTable();
    },

    // Changes control status of variable by its id.
    changeVarControl(variable) {
        fromTable = this._getTable(variable.controllable);
        toTable = this._getTable(!variable.controllable);

        variable.controllable = !variable.controllable;

        const row = fromTable.table.querySelector(`tr[data-id='${variable.id}']`);

        fromTable.count.decrement();
        toTable.count.increment();
        toTable.table.appendChild(row);

        CytoscapeEditor.highlightControllable([variable]);
    },

    // Add drag and drop handlers for moving rows between tables
    addDragAndDropHandlers(table) {
        table.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        table.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedRow = document.querySelector('.dragging');

            if (draggedRow) {
                const variable = LiveModel.variableFromId(draggedRow.getAttribute("data-id"));
                const fromTable = this._getTable(variable.controllable);

                const newControllability = table.id == "Controllable" ? true : false;
                const toTable = this._getTable(newControllability);

                fromTable.count.decrement();
                toTable.count.increment();
                variable.controllable = newControllability;

                table.getElementsByTagName('tbody')[0].appendChild(draggedRow);
                CytoscapeEditor.highlightControllable([variable]);
            }
        });
    }
};