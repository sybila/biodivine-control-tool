from Code.Utils import print_results, get_filter
from itertools import combinations

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

    filter_card = get_filter(max_cardinality, 0)
    filter_size = get_filter(None, 1)
    number = get_filter(None, 2)
    
    print_results(subsets, max_cardinality, number, filter_card, filter_size, "\n----Subsets of working perturbations----")

    return subsets
