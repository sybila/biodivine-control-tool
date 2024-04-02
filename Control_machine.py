import biodivine_aeon as ba
from biodivine_aeon import *
from itertools import combinations
from pathlib import Path
from copy import deepcopy

""" Program for permanent control over parially specified boolean networks.

First the inserted phenotype is proccessed, after that you can choose
from working perturbation the extension of the previous phenotype. """


PATH = "C:\\Venca - soubory\\Škola\\Sybila\\Models\\Budding yeast cell cycle (Orlando).aeon"
OSCILLATION = False
SIZE = None
ROBUSTNESS = 0.01
PHENOTYPE = [("CLN3", True)]

#----------------------------------------------------------------

""" Printing function """
def print_results(perts, model_cardinality, number, min_card, max_size, title):
    print(title)

    index = 0
    last_card = None
    last_size = None

    for pert in perts:
        if number != 0 and index == number:
            break

        now_card = pert[1].cardinality()
        now_size = len(pert[0])

        if (min_card > 0 and now_card < min_card) or (max_size > 0 and max_size < now_size):
            continue

        if last_card is None or now_card != last_card:
            last_card = now_card
            last_size = None
            print("\n" + "****cardinality " + str(last_card) + " (maximal cardinality = " + str(model_cardinality) + ")****")

        if last_size is None or now_size != last_size:
            if last_size != None:
                print()

            last_size = now_size
            print("//size " + str(last_size) + "//")

        print(str(index + 1) + ". " + str(pert[0]))
        index += 1

    print("\n")
    return

""" Converts phenotype_list intot the form accepted by the control function. """
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

""" Filters out perturbation with fixed phenotype """
def filter_fixed_phenotype(working_perts, phen_keys):
    filtered_perts = [];
    
    for ind in range(len(working_perts)):
        if len(set(working_perts[ind][0].keys()).intersection(phen_keys)) != len(phen_keys):
            filtered_perts.append(working_perts[ind])

    return filtered_perts

""" Function implementing control routine. """
def control(model, phenotype_list, oscillation):

    pert_graph = ba.PerturbationGraph(model)

    phenotype, phen_keys = create_phenotype(model, pert_graph, phenotype_list)

    control_map = pert_graph.ceiled_phenotype_permanent_control( phenotype = phenotype,
                                                                size_bound = SIZE if SIZE != None else 100,
                                                                oscillation = oscillation,
                                                                stop_early = False,
                                                                verbose = False )
    
    return filter_fixed_phenotype(control_map.working_perturbations(min_robustness=ROBUSTNESS, verbose=False), phen_keys)

""" Gets user imput about filtering of cardinality, size and printed amount of data """
def get_filters(max_cardinality):
    filter_card = input("Choose minimal cardinality:" + " (maximal cardinality = " + str(max_cardinality) + ")" + "\n\
                0 = no filter\n\
                1-∞ = minimal cardinality\n")
            
    filter_size = input("Choose maximal size:\n\
                0 = no filter\n\
                1-∞ = maximal size\n")
            
    number = input("Write the number of data to be printed:\n\
                0 = all data\n\
                1-∞ = number of data\n")
    
    return int(filter_card), int(filter_size), int(number)


""" Function for printing perturbations and data about them """
def print_perturbations(working_perts, max_cardinality):

    filter_card, filter_size, number = get_filters(max_cardinality)
            
    print_results(working_perts, max_cardinality, number, filter_card, filter_size, "\n----Working perturbations----")
    return

""" Finds if pertrubation subsets are in the subsets array,
    if yes then adds its cardinality, else adds the whole subset """
def set_subsets(subsets_dict, pert_subs, card):
    for pert_sub_i in range(len(pert_subs)):

        if (len(pert_subs[pert_sub_i]) not in subsets_dict):
            subsets_dict[len(pert_subs[pert_sub_i])] = [(pert_subs[pert_sub_i], card.copy_with(card.to_bdd()))]
            continue

        for sub_i in range(len(subsets_dict[len(pert_subs[pert_sub_i])]) + 1):
            if sub_i == len(subsets_dict[len(pert_subs[pert_sub_i])]):
                subsets_dict[len(pert_subs[pert_sub_i])].append((pert_subs[pert_sub_i], card))

            if subsets_dict[len(pert_subs[pert_sub_i])][sub_i][0] == pert_subs[pert_sub_i]:
                subsets_dict[len(pert_subs[pert_sub_i])][sub_i] = (subsets_dict[len(pert_subs[pert_sub_i])][sub_i][0],\
                                                                   subsets_dict[len(pert_subs[pert_sub_i])][sub_i][1].union(card))
                break
    return

""" Creates all combinations of fixed values present in perturbation """
def create_pert_subs(pert):
    
    pert_items = pert.items()

    pert_subs = [dict((var, fix) for (var, fix) in com) for com_size in range(1, len(pert_items)) for com in combinations(pert_items, com_size)]

    return pert_subs

""" Creates subsets from all the working perturbations """
def create_subsets(working_perts):
    subsets = []

    subsets_dict = dict()

    for pert, card in working_perts:
        pert_subs = create_pert_subs(pert)
        set_subsets(subsets_dict, pert_subs, card)

    for key in subsets_dict.keys():
        for sub in subsets_dict[key]:
            subsets.append(sub)

    subsets.sort(reverse = True, key = lambda sub: (sub[1].cardinality(), -len(sub[0])))

    return subsets
    

""" Fuction for printing perturbation subsets and data about them """
def print_subsets(subsets, working_perts, max_cardinality):
    if (len(subsets) == 0):
        subsets = create_subsets(working_perts)

    filter_card, filter_size, number = get_filters(max_cardinality)
    
    print_results(subsets, max_cardinality, number, filter_card, filter_size, "\n----Subsets of working perturbations----")

    return subsets

""" Processes data in the way chosen by user """
def data_processor(working_perts, max_cardinality):
    subsets = []

    while True:
        function = input("Choose function:\n\
                0 = print perturbations\n\
                1 = print subsets of working perturbations\n\
                2 = end\n")

        if function == "0":
            print_perturbations(working_perts, max_cardinality)
        elif function == "1":
            subsets = print_subsets(subsets, working_perts, max_cardinality)
        else:
            return(0)


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
