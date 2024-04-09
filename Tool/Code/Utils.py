""" Function for printing ranked data """
def print_rank(perts, number, max_rank, max_size, title):
    print(title)

    index = 0
    rank = 0

    last_eval = None
    last_size = None

    for pert in perts:
        if (number != 0 and index == number) or (rank != 0 and max_rank != 0 and rank > max_rank):
            break

        now_eval = pert[1]
        now_size = len(pert[0])

        if last_eval is None or now_eval != last_eval:
            last_eval = now_eval
            rank += 1
            last_size = None
            if (max_size <= 0 or max_size >= now_size):
                print("\n" + "****rank " + str(rank) + "****")

        if (max_size > 0 and max_size < now_size):
            continue

        if last_size is None or now_size != last_size:
            if last_size != None:
                print()

            last_size = now_size
            print("//size " + str(last_size) + "//")

        print(str(index + 1) + ". " + str(pert[0]))
        index += 1

    print("\n")
    return


""" Printing function """
def print_results(perts, model_cardinality, number, min_card, max_size, title):
    print(title)

    index = 0
    last_card = None
    last_size = None

    for pert in perts:
        now_card = pert[1].cardinality()

        if (min_card > 0 and now_card < min_card) or (number != 0 and index == number):
            break

        now_size = len(pert[0])

        if  max_size > 0 and max_size < now_size:
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

""" Gets user input about data filtering """
def get_filter(max_cardinality, filt_type):
    filter_mess = None

    if (filt_type == 0):
        filter_mess = "Choose minimal cardinality:" + " (maximal cardinality = " + str(max_cardinality) + ")" + "\n\
                    0 = no filter\n\
                    1-∞ = minimal cardinality\n"
    elif (filt_type == 1):
        filter_mess = "Choose maximal size:\n\
                0 = no filter\n\
                1-∞ = maximal size\n"
    elif (filt_type == 2):
        filter_mess = "Write the number of data to be printed:\n\
                0 = all data\n\
                1-∞ = number of data\n"
    elif (filt_type == 3):
        filter_mess = "Choose maximal rank:\n\
                0 = no filter\n\
                1-∞ = maximal rank\n"

    filt_value = input(filter_mess)

    return int(filt_value)

""" Processes data in the way chosen by user """
def data_processor(working_perts, max_cardinality):

    from Code.Perturbations import print_perturbations
    from Code.Subsets import print_subsets

    evaluated_perts = []
    subsets = []

    while True:
        function = input("Choose function:\n\
                0 = print perturbations\n\
                1 = print subsets of working perturbations\n\
                2 = end\n")

        if function == "0":
            evaluated_perts = print_perturbations(working_perts, evaluated_perts, max_cardinality)
        elif function == "1":
            subsets = print_subsets(subsets, working_perts, max_cardinality)
        else:
            return(0)

