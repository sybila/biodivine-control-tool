import biodivine_aeon as ba
from biodivine_aeon import *
from pathlib import Path
from Code.GUI import data_processor_GUI
from Code.Utils import data_processor

""" Program for permanent control over parially specified boolean networks.

First the inserted phenotype is proccessed, after that you can choose
from working perturbation the extension of the previous phenotype. """


PATH = "C:\\Venca - soubory\\Škola\\Sybila\\Models\\Asymmetric Cell Division A no loop.aeon"

# "C:\\Venca - soubory\\Škola\\Sybila\\Models\\Budding yeast cell cycle (Orlando).aeon"
#"C:\\Venca - soubory\\Škola\\Sybila\\Models\\model_complete_all_general.aeon"

PHENOTYPE = [("DnaA", True), ("SciP", True), ("GcrA", False)]
CONTROLLABLE = ["DnaA", "CcrM", "GcrA"]
OSCILLATION = "Allowed"
SIZE = 100
ROBUSTNESS = 0.01

#----------------------------------------------------------------
""" Adds ranking to the perturbations. """
def add_ranking(working_perts, max_cardinality):
    evaluated_perts = []

    for perts, card in working_perts:
        evaluated_perts.append((perts, card, (max_cardinality - card.cardinality()) + len(perts)))
    
    evaluated_perts.sort(key = lambda pert: (pert[2], len(pert[0])))

    last_eval = None
    rank = 0

    for pert_ind in range(len(evaluated_perts)):
        if (last_eval == None or last_eval != evaluated_perts[pert_ind][2]):
            last_eval = evaluated_perts[pert_ind][2]
            rank += 1

        evaluated_perts[pert_ind] = (evaluated_perts[pert_ind][0], evaluated_perts[pert_ind][1], rank)

    return evaluated_perts

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

""" Finds out if perturbation is subset of another perturbation """
def perturbation_is_sub(pert, bigger_pert):
    for key in pert.keys():
        if (pert.get(key) != bigger_pert.get(key)):
            return False

    return True

""" Finds out if part of perturbation is one of the already found perturbations. """
def is_part_of(pert, filtered_perts, card_change_ind):
    for ind in range(card_change_ind, len(filtered_perts)):

        if len(pert[0]) <= len(filtered_perts[ind][0]):
            break

        if perturbation_is_sub(filtered_perts[ind][0], pert[0]) and (filtered_perts[ind][1] == pert[1]):
            return True

    return False

""" Filters out perturbation with fixed phenotype """
def filter_redundant_data(working_perts, phen_keys):
    filtered_perts = [];

    card_change_ind = 0
    filtered_ind = -1

    for ind in range(len(working_perts)):
        if len(set(working_perts[ind][0].keys()).intersection(phen_keys)) == len(phen_keys):
            continue

        if filtered_ind >= 0:
            if working_perts[ind][1].cardinality() != filtered_perts[card_change_ind][1].cardinality():
                card_change_ind = filtered_ind
            elif is_part_of(working_perts[ind], filtered_perts, card_change_ind):
                continue

        filtered_perts.append(working_perts[ind])
        filtered_ind += 1

    return filtered_perts

""" Function implementing control routine. """
def control(model, phenotype_list, oscillation):
    pert_graph = None

    if (len(CONTROLLABLE) <= 0):
        pert_graph = ba.PerturbationGraph(model)
    else:
        pert_graph = ba.PerturbationGraph.with_restricted_variables(model, perturb=CONTROLLABLE)

    phenotype, phen_keys = create_phenotype(model, pert_graph, phenotype_list)

    control_map = pert_graph.ceiled_phenotype_permanent_control( phenotype = phenotype,
                                                                size_bound = SIZE if SIZE != None else model.graph().num_vars(),
                                                                oscillation = oscillation,
                                                                stop_early = False,
                                                                verbose = False )

    return control_map.working_perturbations(min_robustness=ROBUSTNESS, verbose=False), phen_keys, pert_graph

""" Main function. """
def control_machine(model_path, phenotype, controllable, oscillation, GUI):
    model_string = Path(model_path).read_text()
    model = ba.BooleanNetwork.from_aeon(model_string)

    working_perts, phen_keys, pert_graph = control(model, phenotype, oscillation)

    working_perts = filter_redundant_data(working_perts, phen_keys)

    max_cardinality = pert_graph.unit_colors().cardinality()

    working_perts = add_ranking(working_perts, max_cardinality)

    working_perts.sort(reverse = True, key = lambda pert: (pert[1].cardinality(), -len(pert[0])))

    if GUI:
        data_processor_GUI(working_perts, max_cardinality, oscillation, phenotype, controllable)
    else:
        data_processor(working_perts, pert_graph.unit_colors().cardinality())

control_machine(PATH, PHENOTYPE, CONTROLLABLE, OSCILLATION, True)