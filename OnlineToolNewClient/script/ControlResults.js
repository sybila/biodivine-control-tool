let ControlResults = {
    _perturbTable: undefined,

    init() {
        document.getElementById("ParamNumberStat").textContent =  localStorage.getItem('parNum');
        const perts = JSON.parse(localStorage.getItem('perturbations'));
        document.getElementById("PertNumberStat").textContent = perts.length;
        document.getElementById("MinSizeStat").textContent = 0;
        document.getElementById("MaxRobStat").textContent = 0;
        document.getElementById("OscillationStat").textContent = localStorage.getItem('oscillation');
        document.getElementById("PhenotypeStat").textContent = localStorage.getItem('phenotype');
        document.getElementById("ControllableStat").textContent = localStorage.getItem('controllable');
        this._perturbTable = document.getElementById("ControlResults");

        this._perturbTable = document.getElementById("ControlResults")
        this._fillTable(perts);
    },

    _appendCell(row, content, width) {
        const cell = document.createElement("td");
        const div = document.createElement("table-div");
        cell.style.width = width;
        cell.style.borderStyle = "solid";
        cell.style.borderWidth = "1px 1px 0px 1px";
        div.style.width = width;
        div.textContent = content;
        cell.appendChild(div);
        row.appendChild(cell);
    },

    _fillTable(perts) {
        let id = 1;

        for (const pert of perts) {
            console.log(pert);
            const row = document.createElement("tr");
            row.setAttribute('data-id', id);

            this._appendCell(row, id, "50px");
            this._appendCell(row, pert[0], "700px");
            this._appendCell(row, pert[0].length, "150px");
            this._appendCell(row, pert[1], "200px");
            this._appendCell(row, pert[2], "100px");

            this._perturbTable.appendChild(row);

            id += 1;
        };
    }
}