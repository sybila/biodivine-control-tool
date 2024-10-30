/** Object responsible for displaying and resolving warning.*/
let Warning = {
    warningDiv: undefined,
    textDiv: undefined,
    buttonDiv: undefined,

    init() {
        this.warningDiv = document.getElementById("warning");
        this.textDiv = document.getElementById("warning-text");
        this.buttonDiv = document.getElementById("warning-buttons");
    },

    /** Returns content of the warning. Warning content is returned as object {"text":, "buttons": htmlCode}.
     *  Parameter warningType is string determining what type of warning content should be returned.
     *  If warning type is not one of the registered warning types, then uses the warningType as text of the warning.
     */
    _getWarningContent(warningType) {
        switch (warningType) {
            case "resultsAvailable":
                return {text: "Results available. If you want to modify the model you have to close all results or open model in a new window.",
                        buttons:    `<button class='centered-button' onclick='Warning.resultsAvailableResolve(null)' style='height: 25px;'>Cancel</button>
                                    <button class='centered-button' onclick='Warning.resultsAvailableResolve(false)' style='height: 25px;'>Delete results</button>
                                    <button class='centered-button' onclick='Warning.resultsAvailableResolve(true)' style='height: 25px;'>Open new window</button>`};
            default:
                return {text: warningType, buttons: "<button class='centered-button' onclick='Warning.closeWarning()' style='height: 25px; margin: auto;'>Close</button>"};
        }
    },

    /** Resolves resultsAvailable warning. If resolveMode is true opens model in new browser tab, 
     *  else if is false deletes available results, else closes warning wihout performing any action. */
	resultsAvailableResolve(resolveMode) {
		if (resolveMode == true) {
			UI.Open.openBrowserTab(false);
		} else if (resolveMode == false) {
			Results.clear();
			TabBar.closeResults();
		}

        this.closeWarning();
	},

    closeWarning() {
        this.warningDiv.style.display = "none";
    },

    /** Displays warning and fills it with content returned by this._getWarningContent function.
     *  Parameter warningType is string determining what type of warning content should be returned.
     */
    displayWarning(warningType) {
        const warningContent = this._getWarningContent(warningType);

        this.textDiv.innerHTML = warningContent.text;
        this.buttonDiv.innerHTML = warningContent.buttons;

        this.warningDiv.style.display = "block";
    }
}