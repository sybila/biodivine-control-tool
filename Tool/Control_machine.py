import biodivine_aeon as ba
from biodivine_aeon import *
from pathlib import Path
from Code.Utils import data_processor

""" Program for permanent control over parially specified boolean networks.

First the inserted phenotype is proccessed, after that you can choose
from working perturbation the extension of the previous phenotype. """


PATH = "C:\\Venca - soubory\\Škola\\Sybila\\Models\\Budding yeast cell cycle (Orlando).aeon"
OSCILLATION = False
SIZE = None
ROBUSTNESS = 0.01
PHENOTYPE = [("CLN3", True)]
PERTURBABLE = []

#----------------------------------------------------------------

""" Converts phenotype_list into the form accepted by the control function. """
def create_phenotype(model, pert_graph, phenotype_list):
    phenotype = None
    phen_keys = set()

    for var_name, fix_val in phenotype_list:
        phen_keys.add(var_name)

        variable = model.find_variable(var_name)
        temp_phen = pert_graph.as_original().unit_colored_vertices().fix_network_variable(variable, fix_val).vertices()

        if phenotype is None:
            phenotype = temp_phen
        else:
            phenotype.union(temp_phen)

    return phenotype, phen_keys

""" Finds out if perturbation is part of smaller perturbation. """
def is_redundant(pert, filtered_perts, card_change_ind):
    return False

    for ind in range(card_change_ind, len(filtered_perts)):
        if (pert[0].items().intersection(filtered_perts[ind][0].items()) == filtered_perts[ind][0].items() and pert[1].cardinality() == pert[1].intersection(filtered_perts[ind][1]).cardinality()):
            return True

    return False

""" Filters out perturbation with fixed phenotype """
def filter_fixed_phenotype(working_perts, phen_keys):
    filtered_perts = [];

    card_change_ind = 0
    filtered_ind = -1

    for ind in range(len(working_perts)):
        if len(set(working_perts[ind][0].keys()).intersection(phen_keys)) == len(phen_keys):
            continue

        if filtered_ind >= 0:
            if working_perts[ind][1].cardinality() != filtered_perts[card_change_ind][1].cardinality():
                card_change_ind = filtered_ind
            elif is_redundant(working_perts[ind], filtered_perts, card_change_ind):
                continue

        filtered_perts.append(working_perts[ind])
        filtered_ind += 1

    return filtered_perts

""" Function implementing control routine. """
def control(model, phenotype_list, oscillation):
    pert_graph = None

    if (len(PERTURBABLE) <= 0):
        pert_graph = ba.PerturbationGraph(model)
    else:
        pert_graph = ba.PerturbationGraph.with_restricted_variables(model, perturb=PERTURBABLE)

    phenotype, phen_keys = create_phenotype(model, pert_graph, phenotype_list)

    control_map = pert_graph.ceiled_phenotype_permanent_control( phenotype = phenotype,
                                                                size_bound = SIZE if SIZE != None else 100,
                                                                oscillation = oscillation,
                                                                stop_early = False,
                                                                verbose = False )

    return filter_fixed_phenotype(control_map.working_perturbations(min_robustness=ROBUSTNESS, verbose=False), phen_keys)

""" Main function. """
def control_machine():
    model_string = Path(PATH).read_text()
    model = ba.BooleanNetwork.from_aeon(model_string)
    pert_graph = ba.PerturbationGraph(model)

    phenotype_list = PHENOTYPE

    working_perts = control(model, phenotype_list, "Allowed" if OSCILLATION else "Forbidden")

    working_perts.sort(reverse = True, key = lambda pert: (pert[1].cardinality(), -len(pert[0])))

    data_processor(working_perts, pert_graph.unit_colors().cardinality())

control_machine()
