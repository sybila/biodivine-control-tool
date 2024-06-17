from Code.Utils import print_results, print_rank, get_filter

""" Function for printing perturbations and data about them """
def print_perturbations(working_perts, evaluated_perts, max_cardinality):
    evaluate = input("Format of perturbations:\n\
                0 = evaluated perturbations (ranked by suitability of  perturbation)\n\
                1 = raw perturbations (ranked by cardinality of perturbations)\n")
    
    if (evaluate == "0"):

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
