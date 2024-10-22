let ControllableEditor = {
    _controllableCountStat:undefined,

    //how many nodes are controllable at the moment
    _controllableCount: undefined,

    _controllableTable: undefined,




    init() {
        this._controllableCountStat = document.getElementById("controllable-count")
        this._controllableTable = document.getElementById("Controllable").getElementsByTagName('tbody')[0];
        this._controllableCount = 0;
    },

    //add Variable into Uncontrollable/Controllable table.
	addVariable: function(id, name) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.textContent = name;
        row.appendChild(cell);
        this._controllableTable.appendChild(row);

        this._controllableCount += 1;

        this._controllableCountStat.textContent = this._controllableCount;

        return;
	},
}