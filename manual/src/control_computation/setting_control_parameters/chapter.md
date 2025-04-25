## Task Settings for Control Computation

This section explains how to configure the necessary settings for computing control in Aeon. Specifically, we cover Control-Enabled status of variables and phenotype definition. Additionally, we discuss ways to refine control computation to obtain only the most relevant results and potentially speed up the process.

### Control-Enabled status of Variables

Control-Enabled status determines whether a variable can be included in computed perturbations. Only variables explicitly marked as Control-Enabled may appear in perturbations. If a variable is Not-Control-Enabled, it remains unaffected by the control process.

### Phenotype

A phenotype is the target state of the Boolean network, defined by a subset of variables assigned specific Boolean values. Control aims to drive the network toward this state, ensuring that once reached, it remains stable.

Additionally, Aeon distinguishes between oscillating and non-oscillating phenotypes. In a non-oscillating phenotype, the network stabilizes in the target state indefinitely. In contrast, an oscillating phenotype allows the network to transition cyclically through a set of states that include the desired phenotype. Aeon supports both types, enabling the analysis and control of networks with stable or dynamic target states.