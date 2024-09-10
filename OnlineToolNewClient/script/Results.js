let Results = {
	controlButton: undefined,
	attractorButton: undefined,
	attractorResWid: undefined,
	controlResWid: undefined,
	attractorResults: undefined,

	// Currently loaded results in the form of JSON
	currAttractorRes: undefined,
	currControlRes: undefined,

	init() {
		this.controlButton = document.getElementById("button-result-attractor");
		this.attractorButton = document.getElementById("button-result-control");
		this.attractorResWid = document.getElementById("attractor-res-widget");
		this.controlResWid = document.getElementById("control-res-widget");
		this.attractorResults = document.getElementById("attractor-results");
		this.currAttractorRes = null;
		this.currControlRes = null;
	},

	clear() {
		document.getElementById("open-tree-explorer").classList.add("gone");
		this.attractorResults.innerHTML = "";
	},

	hasResults() {
		return this.attractorResults.getElementsByClassName("table-head").length > 0;
	},

	_insertAttractorRes(resJson) {
		this.currAttractorRes = resJson;
		let result = resJson.data.sort((a, b) => b.sat_count - a.sat_count);
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
		if (resJson.isPartial) {	// if the computation is not finished, add 
			table = "<h4 class='orange' style='text-align:center;'>Warning: These are partial results from an unfinished computation.</h4>" + table;
		} else {
			table = "<div class='center'>Elapsed: " + (resJson.elapsed/1000) + "s</div>" + table;
		}
		this.attractorResults.innerHTML = table;
		document.getElementById("open-tree-explorer").classList.remove("gone");
		UI.ensureContentTabOpen(ContentTabs.results);
	},

	download() {
		console.log("Download...")
		UI.isLoading(true);
		ComputeEngine.getResults((e, json) => {
			UI.isLoading(false);
			ComputeEngine.waitingForResult = false;
			if (e !== undefined) {
				alert(e);
			} else {
				this._insertAttractorRes(json);
			}
		});
	},

	_resultsToStr() {
		return JSON.stringify(this.currAttractorRes);
	},

	exportResults() {
		let modelFile = Results._resultsToStr();
		if (modelFile === undefined) {
			alert(Strings.modelEmpty);
			return;
		}
		let filename = ModelEditor.getModelName();
        if (filename === undefined) {
        	filename = "model";
        }
        UI._downloadFile(filename + ".aeonr", modelFile)
	},

	_importFromFile(resultStr) {
		this._insertAttractorRes(JSON.parse(resultStr));
	},

	importResults(element) {
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
	}
}
