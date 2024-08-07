let PhenotypeEditor = {
    _trueTable: undefined,
    _falseTable: undefined,
    _notInTable: undefined,
    _oscillationButton: undefined,
    _oscillation: undefined,

    // Initialize the editor
    init() {
        var tableNow = document.getElementById("True");
        this._trueTable = new TableWidget(tableNow.getElementsByTagName('tbody')[0],
                            document.getElementById("TrueFilter"),
                            new CountWidget(document.getElementById("trueCount"), 0));
        this.addDragAndDropHandlers(tableNow);
        
        tableNow = document.getElementById("False");
        this._falseTable = new TableWidget(tableNow.getElementsByTagName('tbody')[0],
                            document.getElementById("FalseFilter"),
                            new CountWidget(document.getElementById("falseCount"), 0));
        this.addDragAndDropHandlers(tableNow);
        
        tableNow = document.getElementById("NotIn");
        this._notInTable = new TableWidget(tableNow.getElementsByTagName('tbody')[0],
                            document.getElementById("NotInFilter"),
                            new CountWidget(document.getElementById("notInCount"), 0));
        this.addDragAndDropHandlers(tableNow);

        this._oscillationButton = document.getElementById('oscillation-switch');
        this.oscillationSwitch();
        this._oscillation = null;
    },

    // Returns table which corresponds with the phenotypeStat value (boolean or null).
    _getTable(phenotypeStat) {
        var table = undefined;

        if (phenotypeStat == null) {
            table = this._notInTable;
        } else if (phenotypeStat == true) {
            table = this._trueTable;
        } else {
            table = this._falseTable;
        }
        return table;
    },

    // Add a variable to the appropriate table
    addVariable(id, name, phenotypeStat) {
        const table = this._getTable(phenotypeStat);
        table.addVariable(id, name);
    },

    // Renames variable in the Phenotype editor.
    renameVariable(id, newName) {
        const table = this._getTable(LiveModel.variableFromId(id).phenotype);
        table.renameById(id, newName);
    },

    // Delete variable by its id from the Phenotype editor.
    removeVariable(id) {
        const table = this._getTable(LiveModel.variableFromId(id).phenotype);
        table.removeFromTable(id);
    },

    // Delete all rows from tables.
    clear() {
        this._trueTable.clear();
        this._falseTable.clear();
        this._notInTable.clear();

        this._oscillationButton.value = "All";
        this._oscillation = null;
    },

    // Filters data from table chosen by the phenotypeStat variable.
    filterTable(phenotypeStat) {
        const table = this._getTable(phenotypeStat)
        table.filterTable();
    },

    oscillationSwitch() {
        this._oscillationButton.addEventListener('click', () => {
            if (this._oscillation == null) {
                this._oscillationButton.value = "Only oscillating";
                this._oscillation = true;
            } else if (this._oscillation) {
                this._oscillationButton.value = "Only non-oscillating";
                this._oscillation = false;
            } else {
                this._oscillationButton.value = "All";
                this._oscillation = null;
            }
            
        });
    },

     // Changes phenotype status of variable by its id and value of the newPhenotype.
    changeVarPhenotype(variable, newPhenotype) {
        fromTable = this._getTable(variable.phenotype);
        toTable = this._getTable(newPhenotype);

        variable.phenotype = newPhenotype;
    
        const row = fromTable.table.querySelector(`tr[data-id='${variable.id}']`);

        fromTable.count.decrement();
        toTable.count.increment();
        toTable.table.appendChild(row);
    
        CytoscapeEditor.highlightPhenotype([variable]);
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
                const fromTable = this._getTable(variable.phenotype);

                const toPhenotype = table.id =="NotIn" ? null :
                                        table.id == "True" ? true : false;
                const toTable = this._getTable(toPhenotype);

                variable.phenotype = toPhenotype;
                
                fromTable.count.decrement();
                toTable.count.increment();
                    
                CytoscapeEditor.highlightPhenotype([variable]);
                table.getElementsByTagName('tbody')[0].appendChild(draggedRow);
            }
        });
    }
};