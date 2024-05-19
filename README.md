# biodivine-control-tool
Tool for control over partially specified boolean networks.

The main goal of this tool helping the user to find the most suitable solution for problems connected with control over partially/fully specified boolean networks.
Another goal of this tool is to produced data about control in form, which is understandable by the user without extensive knowledge of control.

PythonTool:

This tool has ability to perform control task with user defined:
path (path to the file with fully or partially specified boolean network on which the control task will be performed)
phenotype (phenotype to be reached)
perturbable (which nodes in the boolean network are perturbable)
oscillation (if phenotype is suposed to oscillate between its values)
size (maximal numeber of the perturbed nodes in perturbations)
robustness (minimal robustness of the perturbations, in what percent of possible parametrizations of the boolean network required perturbations should work)

Except control task itself the tool is also able to work on data which are produced by the control and present them to the user.
At the moment implemented functionality consists of:

presenting perturbations:
  sorted by rank (which is calculated depending on the cardinality and size of the perturbation)
    these can be filtered by rank, size and number of data the user wants
  sorted by cardinality and size
    these can be filtered by cardinality, size and number of data the user wants
    
presenting subsets of perturbations (which combinations of perturbed nodes are present in perturbations):
    sorted by cardinality and size
      these can be filtered by cardinality, size and number of data the user wants

The tool is mostly build over biodivine-aeon python module which provides functionality needed for the control tasks. 

In the future should include:

ability to analyse control data and present them in the form of graphs
posibility to export/load calculated control data
tools desktop application build on tauri
graphical interface for navigation in control produced data
analysis of the partially specified boolean network's colours through perturbations
AI based tools for analysis of the most viable perturbation
