let Results = {
	//Divs for different possible results, 
	emptyResults: undefined,
	attractorResults: undefined,
	controlResults: undefined,

	//Divs where the computed data are inserted
	attractorInput: undefined,
	controlInput: undefined,

	// Currently loaded results in the form {"type": ResultsType, "data": resultsData}
	loadedResults: undefined,

	init() {
		this.emptyResults = document.getElementById("empty-results");
		this.attractorResults = document.getElementById("attractor-results");
		this.controlResults = document.getElementById("control-results");

		this.attractorInput = document.getElementById("attractor-results-input");
		this.controlInput = document.getElementById("control-results-input");
		this.loadedResults = null;
	},

	clear() {
		document.getElementById("open-tree-explorer").classList.add("gone");
		this.emptyResults.style.display = "";
		this.attractorResults.style.display = "none";
		this.controlResults.style.display = "none";
		this.controlInput.innerHTML = "";
		this.attractorInput.innerHTML = "";
	},

	hasResults() {
		return this.emptyResults.style.display == "none";
	},

	download() {
		console.log("Download...")
		UI.isLoading(true);
		ComputeEngine.getResults((e, type, resultData) => {
			UI.isLoading(false);
			ComputeEngine.waitingForResult = false;
			if (e !== undefined) {
				alert(e);
			} else {
				this.importResults({"type":type, "data":resultData});
			}
		});
	},

	_insertAttractorRes(res) {
		let result = res.data.sort((a, b) => b.sat_count - a.sat_count);
		if (!result) {
			return false;
		}

		const paramsNum = result.reduce((acc, curr) => acc + curr.sat_count, 0);
		//DomElements.statusPanels.result.innerText = 'total parametrizations: ' + paramsNum;

		var table = '';

		result.forEach(({ sat_count, phenotype })=> {
			var behavior = phenotype.map(x => x[0]).sort().join('');
			let behaviorString = behavior;
			if (behaviorString == 0) {
				behaviorString = "<span style=\"font-family: 'FiraMono'; letter-spacing: normal;\">unclassified</span>";
			}
			table += `
				<tr>
					<td class="table-behavior">${behaviorString}</td>
					<td class="table-sat-count">${sat_count}</td>
					<td><span class="inline-button" onclick="UI.openWitness('${behavior}');">Witness</span></td>
					<td><span class="inline-button" onclick="UI.openExplorer('${behavior}');">Attractor</span></td>
				</tr>
			`;
		});

		table = `
			<div class="center">Total number of classes: ${result.length}</div>
			<table>
				<tr class='table-head'>
					<td>Behavior<br>class</td>
					<td>Witness<br>count</td>
					<td></td>
				</tr>
				${table}
			</table>
		`;
		if (res.isPartial) {	// if the computation is not finished, add 
			table = "<h4 class='orange' style='text-align:center;'>Warning: These are partial results from an unfinished computation.</h4>" + table;
		} else {
			table = "<div class='center'>Elapsed: " + (res.elapsed/1000) + "s</div>" + table;
		}

		this.attractorInput.innerHTML = table;
		this.emptyResults.style.display = "none";
		this.controlResults.style.display = "none";
		this.attractorResults.style.display = "";
		document.getElementById("open-tree-explorer").classList.remove("gone");
		UI.ensureContentTabOpen(ContentTabs.results);
	},

	_insertControlRes(res) {
		this.controlInput.innerHTML = `<table>
											<tr class="row"> <td style="text-align: left;">Elapsed: </td> <td class="value">${res.elapsed/1000}s</td>
											<tr class="row"> <td style="text-align: left;">Number of Param: </td> <td class="value">${res.parNum}</td>
											<tr class="row"> <td style="text-align: left;">Number of Pert: </td>  <td class="value">${res.perturbations.length}</td>
											<tr class="row"> <td style="text-align: left;">Minimal Size: </td>  <td class="value">0</td>
											<tr class="row"> <td style="text-align: left;">Maximal Robustness: </td>  <td class="value">0</td>
											<tr class="row"> <td style="text-align: left;">Oscillation: </td> <td class="value">${res.oscillation}</td>
										</table>
									   `;

									   
		this.emptyResults.style.display = "none"
		this.attractorResults.style.display = "none";
		this.controlResults.style.display = "";
		UI.ensureContentTabOpen(ContentTabs.results);
	},

	//Imports results from results object {"type": resultType, "data":resultData}
	importResults(results) {
		if (results.type != undefined && results.data != undefined) {
			this.loadedResults = results;

			if (results.type == "attractor") {
				this._insertAttractorRes(results.data);
			} else if (results.type == "control") {
				this._insertControlRes(results.data);
			}

			LiveModel.saveModel();
		}
	},

	//Exports results into string '#results:ResultType:ResultJson\n'.
	//Returns empty string if there are no results.
	exportResults() {
		if (this.loadedResults == undefined) {
			return "";
		}

		return "#results:" + this.loadedResults.type + ":" + JSON.stringify(this.loadedResults.data) + "\n";
	},

	importResultsFromFile(element) {
		var file = element.files[0];
		if (file) {
			var fr = new FileReader();
	        fr.onload = (e) => {
	        	let error = this._importFromFile(e.target.result);
	        	if (error !== undefined) {
	        		alert(error);
	        	}
				element.value = null;
	        };
	        fr.readAsText(file);
		}        
	},

	exportResultsIntoFile() {
		let modelFile = this.loadedResults;
		if (modelFile === undefined) {
			alert(Strings.modelEmpty);
			return;
		}
		let filename = ModelEditor.getModelName();
        if (filename === undefined) {
        	filename = "model";
        }
        UI._downloadFile(filename + ".aeonr", modelFile)
	}
}
