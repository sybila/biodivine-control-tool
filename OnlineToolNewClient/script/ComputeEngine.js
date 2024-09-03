/*
	Compute engine object maintains connection to the rust backend that will actually
	do the work for us.
*/
let ComputeEngine = {

	waitingForResult: false,
	_address: "http://localhost:8000",
	_connected: false,
	_pingRepeatToken: undefined,
	// a timestamp of last successfully started computation
	// if status returns a different timestamp, we know results are out of date
	_lastComputation: undefined,
	// If is true, then computes control, else computes atractor analysis.
	_computateControl: false,

	// Open connection, taking up to date address from user input.
	// Callback is called upon first ping.
	openConnection(callback = undefined, address = undefined) {
		if (address !== undefined && address !== null) {
			this._address = address;
		} else if (document.getElementById("engine-address") != null) {
			this._address = document.getElementById("engine-address").value;
		}
		this.ping(true, 2000, function(error, ping) {
			if (ping !== undefined && ping["version"] != EXPECTED_ENGINE_VERSION) {
				alert(
					"Your AEON client version is " + EXPECTED_ENGINE_VERSION + 
					", but your compute engine version is " + ping["version"] + ". \n\n" +
					"You may encounter compatibility issues. For best experience, please " +
					"download recommended engine binary from the `Compute Engine` panel."
				);
			}
			if (callback !== undefined) {
				callback(error, ping);
			}
		});		
	},

	getAddress() {
		return this._address;
	},

	// indicate that this is the computation the server currently stores
	setActiveComputation(timestamp) {
		if (this._lastComputation != timestamp) {
			// if timestamp changed, switch to undefined.
			this._lastComputation = undefined;
		}
	},

	// return true if the computation on server is also the one we remember last
	hasActiveComputation() {
		return this._lastComputation !== undefined;
	},

	// Open or close connection connection, depending on current status.
	toggleConnection(callback = undefined) {
		if (this._connected) {
			this.closeConnection();
		} else {
			this.openConnection(callback);
		}
	},

	// Close current connection - return true if really closed.
	closeConnection() {
		if (this._pingRepeatToken !== undefined) {
			clearTimeout(this._pingRepeatToken);
			this._pingRepeatToken = undefined;
			this._connected = false;
			if (typeof UI !== 'undefined') {
				UI.updateComputeEngineStatus("disconnected");
			}			
			return true;
		} else {
			return false;
		}		
	},

	// Return current connection status.
	isConnected() {
		return this._connected;
	},

	// Send a validation request for a model fragment.
	validateUpdateFunction(modelFragment, callback) {
		if (this.isConnected()) {
			return this._backendRequest("/check_update_function", callback, "POST", modelFragment);
		} else {
			callback("Compute engine not connected.");
			return undefined;
		}
	},

	sbmlToAeon(_sbmlString, callback) {
		// This function is dynamically replaced with a "native" WASM module once it is loaded.
		// See `patch-wasm.js` for details.
		callback("Compute engine not connected.");
		return undefined;
	},

	aeonToSbml(_aeonString, callback) {
		// This function is dynamically replaced with a "native" WASM module once it is loaded.
		// See `patch-wasm.js` for details.
		callback("Compute engine not connected.");
		return undefined;		
	},

	aeonToSbmlInstantiated(_aeonString, callback) {
		// This function is dynamically replaced with a "native" WASM module once it is loaded.
		// See `patch-wasm.js` for details.
		callback("Compute engine not connected.");
		return undefined;		
	},

	bnetToAeon(_bnetString, callback) {
		// This function is dynamically replaced with a "native" WASM module once it is loaded.
		// See `patch-wasm.js` for details.
		callback("Compute engine not connected.");
		return undefined;
	},

	aeonToBnet(_aeonString, callback) {
		// This function is dynamically replaced with a "native" WASM module once it is loaded.
		// See `patch-wasm.js` for details.
		callback("Compute engine not connected.");
		return undefined;		
	},	

	startComputation(aeonString) {
		if (this._computateControl) {
			localStorage.setItem('parNum', 500000000000000000000);
			localStorage.setItem('perturbations', JSON.stringify([[["GcrA:true", "CtrC:false"], 500, 60], 
													[["GcrA:true", "LmDsd:true"], 90, 40],
													[["dsadasd:true", "LmDsd:false", "CtrC:true"], 90000, 30],
													[["CtrC:false"], 1, 40],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90],
													[["GcrA:true", "CtrC:false", "LmDsd:true", "dsadasd:false"], 2000000, 90]]));
			localStorage.setItem('controllable', ["GcrA", "CtrC", "LmDsd", "dsadasd", "dsadasd"]);
			localStorage.setItem('phenotype', JSON.stringify(["GcrA:true", "CtrC:false", "LmDsd:true", "dsddsddsddsddsddsddsddsddsddsddsddsddsddsddsddsd:false", "dsadasd:false"]));
			localStorage.setItem('oscillation', "All");
			window.open("controlResults.html", "_blank");
			return;
		}

		if (aeonString === undefined) {
			alert("Empty model.");
			return undefined;
		}
		if (!this.isConnected()) {
			alert("Compute engine not connected.");
			return undefined;
		} else {
			Results.clear();

			if (!this._computateControl) {
				this.waitingForResult = true;
				return this._backendRequest("/start_computation", (e, r) => {
					if (e !== undefined) {
						console.log(e);
						alert("Computation error: "+e);					
					} else {
						console.log("Started computation ",r.timestamp);
						this._lastComputation = r.timestamp;
					}
					this.ping();
				}, "POST", aeonString);
			}

			console.log("Control backend implementation needed.");
			return;
		}
	},

	cancelComputation() {
		if (!this.isConnected()) {
			alert("Compute engine not connected.");
			return undefined;
		} else {
			return this._backendRequest("/cancel_computation", (e, r) => {
				if (e !== undefined) {
					console.log(e);
					alert("Error: "+e);					
				}
				this.ping();
			}, "POST", "");
		}
	},

	getResults(callback) {
		if (!this.isConnected()) {
			callback("Compute engine not connected.");
			return undefined;
		} else {
			return this._backendRequest("/get_results", (e, r) => {
				console.log(e, r);
				if (callback !== undefined) {
					callback(e, r);
				}
			}, "GET");
		}
	},

	// Force requests connection even when ping was not established (for situations
	// where this is the first call).
	getWitness(witness, callback, force = false) {		
		if (!force && !this.isConnected()) {
			callback("Compute engine not connected.");
			return undefined;
		} else {
			return this._backendRequest("/get_witness/"+witness, (e, r) => {
				if (callback !== undefined) {
					callback(e, r);
				}
			}, "GET");
		}
	},

	getTreeWitness(nodeId, callback, force = false) {
		if (!force && !this.isConnected()) {
			callback("Compute engine not connected.");
			return undefined;
		} else {
			return this._backendRequest("/get_tree_witness/"+nodeId, (e, r) => {
				if (callback !== undefined) {
					callback(e, r);
				}
			}, "GET");	
		}
	},

	getBifurcationTree(callback, force = false) {
		if (!force && !this.isConnected()) {
			callback("Compute engine not connected.");
			return undefined;
		} else {
			return this._backendRequest("/get_bifurcation_tree/", (e, r) => {
				if (callback !== undefined) {
					callback(e, r);
				}
			}, "GET");
		}
	},

	autoExpandBifurcationTree(node, depth, callback) {
		return this._backendRequest("/auto_expand/"+node+"/"+depth, (e, r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		}, "POST");
	},

	getDecisionAttributes(node, callback) {
		return this._backendRequest("/get_attributes/"+node, (e, r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		});
	},

	applyTreePrecision(precision, callback) {
		return this._backendRequest("/apply_tree_precision/"+precision, (e,r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		}, "POST");
	},

	getTreePrecision(callback) {
		return this._backendRequest("/get_tree_precision/", (e, r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		}, "GET");
	},

	selectDecisionAttribute(node, attr, callback) {
		return this._backendRequest("/apply_attribute/"+node+"/"+attr, (e, r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		}, "POST");
	},

	deleteDecision(nodeId, callback) {
		return this._backendRequest("/revert_decision/"+nodeId, (e, r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		}, "POST");
	},

	getStabilityData(nodeId, behaviour, callback) {
		return this._backendRequest("/get_stability_data/"+nodeId+"/"+behaviour, (e, r) => {
			if (callback !== undefined) {
				callback(e, r);
			}
		}, "GET");
	},

	// Send a ping request. If interval is set, the ping will be repeated
	// until connection is closed. (Callback is called only once)
	ping(keepAlive = false, interval = 2000, callback = undefined) {
		// if this is a keepAlive ping, cancel any previous pings...
		if (keepAlive && this._pingRepeatToken !== undefined) {
			clearTimeout(this._pingRepeatToken);
			this._pingRepeatToken = undefined;
		}		
		this._backendRequest("/ping", (error, response) => {
			this._connected = error === undefined;
			let status = "disconnected";
			if (this._connected) {
				status = "connected";
			}
			//console.log("...ping..."+status+"...");
			if (typeof UI !== 'undefined') {
				UI.updateComputeEngineStatus(status, response);
			}			
			// Schedule a ping for later if requested.
			if (keepAlive && error === undefined) {
				this._pingRepeatToken = setTimeout(() => { this.ping(true, interval); }, interval);
			}
			if (callback !== undefined) {
				callback(error, response);
			}			
		});
	},

	// Changes computation mode of the engine (changes value of the this._computateControl). 
	changeComputation(mode) {
		this._computateControl = mode;

		const atractorButton = document.getElementById("button-attractor");
		const controlButton = document.getElementById("button-control");
		
		if (mode) {
			atractorButton.style.backgroundColor = "#ECEFF1";
			controlButton.style.backgroundColor = '#B0BEC5';
		} else {
			atractorButton.style.backgroundColor = '#B0BEC5';
			controlButton.style.backgroundColor = '#ECEFF1';
		}
	},

	// Build and return an asynchronous request with given parameters.
	_backendRequest(url, callback = undefined, method = 'GET', postData = undefined) {
        var req = new XMLHttpRequest();

        req.onload = function() {
        	if (callback !== undefined) {
        		let response = JSON.parse(req.response);
        		if (response.status) {
        			callback(undefined, response.result);
        		} else {	// server returned an error
        			callback(response.message, undefined);
        		}
        	}        	
        }

        req.onerror = function(e) {
        	if (callback !== undefined) {
				callback("Connection error", undefined);
        	}
        }

        req.onabort = function() {
        	console.log("abort: ", req);
        }

        req.open(method, this._address + url);
    	if (method == "POST" && postData !== undefined) {
    		req.send(postData);
    	} else {
    		req.send();
    	}

    	return req;
    },

	// Control function headers.

	/** Starts computation of control.
	 *  aeonString (str) = model in the aeon format passed as string,
	 * 		control data are encoded as = #control:VARIABLENAME:cCONTROLLABILITY,pPHENOTYPESTATUS
	 * 		controlability values are true(controllable), false(not controllable), phenotype values are true(var in phenotype as true),
	 * 		false (var in phenotype as false), null (var not present in phenotype)
	 * 	oscillation (nullable boolean) = true if we want results only for oscillationg phenotype,
	 * 		false if we want results only for non oscillating phenotype, null if want results for both
	 * 	minCardinality (int) = minimal cardinality of the computed perturbations
	 * 	maxSize (int) = maximal size of the computed perturbations
	 * 	numberResults (int) = optional argument, limits amount of computed perturbations
	 */
	startComputationControl(aeonString, oscillation, minCardinality, maxSize, numberResults = undefined) {return;},

	/** Cancels now running control computation and saves partial results.
	*/
	cancelControlComp() {return;},

	/** Returns all computed perturbations in iterable form (for example array of dicts, array of arrays, iterator of objects...)
	*/
	getresults() {return;},

	/** Returns stats about the computation. Maximal cardinality of the model, number of computed perturbations. 
	*/
	getStats() {return;},

	/** Returns status of the computation at the moment. Number of computed perturbations, if possible then also computation progress in %.*/
	getCompStatus() {return;}
}