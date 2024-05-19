from Code.Utils import print_results, print_rank, get_filter

""" Creates list of working perturbations ranked by their suitability. """
def create_evaluated(working_perts, max_cardinality):
    evaluated_perts = []

    for perts, card in working_perts:
        evaluated_perts.append((perts, (max_cardinality - card.cardinality()) + len(perts)))
    
    evaluated_perts.sort(key = lambda pert: (pert[1], len(pert[0])))

    return evaluated_perts

""" Function for printing perturbations and data about them """
def print_perturbations(working_perts, evaluated_perts, max_cardinality):
    evaluate = input("Format of perturbations:\n\
                0 = evaluated perturbations (ranked by suitability of  perturbation)\n\
                1 = raw perturbations (ranked by cardinality of perturbations)\n")
    
    if (evaluate == "0"):
        if (len(evaluated_perts) != len(working_perts)):
            evaluated_perts = create_evaluated(working_perts, max_cardinality)

        filter_rank = get_filter(None, 3)
        filter_size = get_filter(None, 1)
        number = get_filter(None, 2)

        print_rank(evaluated_perts, number, filter_rank, filter_size, "\n----Ranked perturbations----")
    else:
        filter_card = get_filter(max_cardinality, 0)
        filter_size = get_filter(None, 1)
        number = get_filter(None, 2)
            
        print_results(working_perts, max_cardinality, number, filter_card, filter_size, "\n----Working perturbations----")

    return evaluated_perts
