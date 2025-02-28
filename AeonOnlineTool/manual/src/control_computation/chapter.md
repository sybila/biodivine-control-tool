# Computation of Control

This section explains how to compute effective perturbations for controlling Boolean networks using Aeon.

## What is Control in Boolean Networks?

Control in Boolean networks refers to the process of guiding the network toward a specific attractor, known as the phenotype. A phenotype represents a target state of the network, defined by a subset of variables assigned specific Boolean values.

To achieve this control, the network requires perturbations—sets of variables that are fixed to particular Boolean values. These perturbations ensure that the network's dynamics stabilize in the desired phenotype.

Aeon provides functionality to compute such perturbations, supporting permanent control, where selected variables remain fixed indefinitely. Once applied, these perturbations guarantee convergence of the network toward the target phenotype.

## Interpretations of the Boolean Network

In this section, we use the term interpretation of the Boolean network/model. This term refers to different fully specified versions of the Boolean network. It is equivalent to the concept of a witness in attractor bifurcation.

The following sections will cover how to compute perturbations and analyze computed perturbations using Aeon’s visualization tools.