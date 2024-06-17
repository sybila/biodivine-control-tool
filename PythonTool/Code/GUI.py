import tkinter as tk
from tkinter import ttk
from typing import List

""" Resizes window of GUI. """
def resize_columns(gui, columns, event):
    width = (event.width - 40) // len(columns)
    for col in columns:
        gui.column(col, width=width)

""" Adds AEON logo into the upper right corner. """
def add_AEON_logo(gui_root):
    upper_right_text = tk.Text(gui_root, height=1, width=16, bg=gui_root.cget("background"), bd=0)
    upper_right_text.tag_configure("dark_blue", foreground="dark blue", font=("Arial", 12, "bold"))
    upper_right_text.tag_configure("light_red", foreground="#FF5733", font=("Arial", 12, "bold"))

    upper_right_text.insert(tk.END, "Aeon/", "dark_blue")
    upper_right_text.insert(tk.END, "BIODIVINE", "light_red")

    upper_right_text.config(state=tk.DISABLED)
    upper_right_text.grid(row=0, column=0, sticky="ne", padx=10, pady=10)

""" Creates overview window where data about control process are displayed. """
def create_overview(gui_root, max_cardinality, num_of_perts, oscillation, controllable, phenotype):
    data_box_frame = tk.Frame(gui_root)
    data_box_frame.grid(row=0, column=0, padx=10, pady=5, sticky="nw")

    data_label = tk.Label(data_box_frame, text="Overview", font=("Arial", 12, "bold"))
    data_label.pack(anchor="w", padx=5, pady=5)

    data_text_frame = tk.Frame(data_box_frame)
    data_text_frame.pack(fill=tk.BOTH, expand=False)

    data_text = tk.Text(data_text_frame, height=5, width=60, wrap=tk.NONE, bd=0, highlightthickness=0)
    data_text.pack(side=tk.LEFT, fill=tk.BOTH)

    text_scrollbar = tk.Scrollbar(data_text_frame, orient=tk.HORIZONTAL, command=data_text.xview, width=2)
    text_scrollbar.pack(side=tk.BOTTOM, fill=tk.X)
    data_text.config(xscrollcommand=text_scrollbar.set)

    data_text.insert(tk.END, "Number of Parametrizations (Cardinality): " + str(max_cardinality) + "\n" + \
                        "Number of Perturbations: " + str(num_of_perts) + "\n" +\
                            "Oscillation: " + oscillation + "\n" \
                                "Phenotype: " + str(controllable) + "\n" \
                                    "Controllable: " + str(phenotype))
    data_text.config(state=tk.DISABLED)

""" Sorts data in the table by int value of data in the table. """
def sort_by_column(gui, column, descending=False):
    data = [(gui.set(child, column), child) for child in gui.get_children('')]

    data.sort(key=lambda x: int(x[0]), reverse=descending)

    for index, (_, child) in enumerate(data):
        gui.move(child, '', index)

    gui.heading(column, command=lambda: sort_by_column(gui, column, not descending))

""" Inserts data about perturbations into table. """
def insert_data(gui, filter_data, perts):
    search: str = filter_data.get("Search", "")
    filters: List[int] = [int(filter_data.get("Size", -1)), int(filter_data.get("Cardinality", -1)), int(filter_data.get("Robustness", -1))]

    for index, pert in enumerate(perts):
        size: int = len(pert[0])
        cardinality: int = int(pert[1].cardinality())

        if (filters[0] == -1 or filters[0] >= size)\
            and (filters[1] == -1 or filters[1] <= cardinality)\
            and (filters[2] == -1 or filters[2] <= pert[2])\
            and (search == "" or (search in pert[0].keys())):

            gui.insert("", tk.END, values=(str(index + 1), str(pert[0]), str(size), str(cardinality), str(pert[2])))

""" Creates table for data about perturbations to be displayedb in. """
def setup_table(gui, columns):
    gui["columns"] = columns

    style = ttk.Style()
    style.configure("Treeview", borderwidth=1, relief="solid")
    style.configure("Treeview.Heading", relief="flat", borderwidth=0)
    style.configure("Treeview.Separator", borderwidth=0)

    gui.column("#0", width=0, stretch=tk.NO)

    for i, column in enumerate(columns):
        if i == 1:
            gui.column(column, width=500)
        else:
            gui.column(column, width=80)
        if i == 0 or i >= len(columns) - 3:
            gui.heading(column, text=column, command=lambda col=column: sort_by_column(gui, col))
        else:
            gui.heading(column, text=column)
        gui.grid_columnconfigure(i, weight=1)

    style.layout("Treeview", [('Treeview.treearea', {'sticky': 'nswe'})])
    style.layout("Treeview.Heading", [
        ("Treeview.padding", {'sticky': 'nswe', 'children':
            [('Treeview.padding', {'sticky': 'nswe', 'children':
                [('Treeview.label', {'sticky': 'nswe'})]
            })]
        }),
        ("Treeview.separator", {'sticky': ''})
    ])

""" Filters perturbations in the table depending on the input of filter and search entries. """
def filter_data(gui, filter_entries, perts):

    filter_conditions = {column: entry.get().strip() for column, entry in filter_entries.items() if entry.get().strip()}
    
    for child in gui.get_children(''):
        gui.detach(child)
    
    insert_data(gui, filter_conditions, perts)

""" Creates filter entries and filter button. """
def create_filters(gui_root, gui, columns, entries, perts):
    filter_frame = tk.Frame(gui_root)
    filter_frame.grid(row=1, column=0, padx=10, pady=10, sticky="e")

    filter_columns = columns[2:]  # We filter by columns excluding the first two ("ID", "Perturbation")
    labels: List[str] = ["Maximal Size:", "Minimal Cardinality:", "Minimal Robustness:"]
    for i, column in enumerate(filter_columns):
        label = tk.Label(filter_frame, text=labels[i])
        entry = tk.Entry(filter_frame)
        label.grid(row=0, column=2 * i, padx=5, pady=5, sticky="e")
        entry.grid(row=0, column=2 * i + 1, padx=5, pady=5, sticky="e")
        entries[column] = entry

    filter_button = tk.Button(filter_frame, text="Filter", command=lambda: filter_data(gui, entries, perts))
    filter_button.grid(row=0, column=2 * len(filter_columns), padx=5, pady=5, sticky="e")

""" Creates search bar and search button. """
def create_search_bar(gui_root, gui, entries, perts):
    search_frame = tk.Frame(gui_root)
    search_frame.grid(row=1, column=0, padx=10, pady=10, sticky="w")

    search_label = tk.Label(search_frame, text="Search:")
    search_label.grid(row=0, column=0, padx=5, pady=5, sticky="w")
    entries["Search"] = tk.Entry(search_frame, width=30)
    entries["Search"].grid(row=0, column=1, padx=5, pady=5, sticky="w")

    search_button = tk.Button(search_frame, text="Search", command=lambda: filter_data(gui, entries, perts))
    search_button.grid(row=0, column=2, padx=5, pady=5, sticky="w")

""" Setups GUI. """
def perturbation_gui(gui_root, perts, max_cardinality, oscillation, controllable, phenotype):
    gui_root.title("Working perturbation")

    add_AEON_logo(gui_root)
    create_overview(gui_root, max_cardinality, len(perts), oscillation, controllable, phenotype)

    columns = ("ID", "Perturbation", "Size", "Cardinality", "Robustness")

    gui = ttk.Treeview(gui_root)
    setup_table(gui, columns)
    
    entries = dict();
    create_search_bar(gui_root, gui, entries, perts)
    create_filters(gui_root, gui, columns, entries, perts)

    gui.grid(row=3, columnspan=len(columns), sticky="nsew", padx=10, pady=5)

    insert_data(gui, {}, perts)

    gui_root.bind("<Configure>", lambda event: resize_columns(gui, columns, event))
    gui_root.grid_rowconfigure(3, weight=1)
    gui_root.grid_columnconfigure(0, weight=1)

""" Main function for GUI. """
def data_processor_GUI(working_perts, max_cardinality, oscillation, phenotype, controllable):
    controllable_string = ", ".join(controllable)
    phenotype_string = ", ".join(["'%s':%s" % phen_var for phen_var in phenotype])
    max_card_int: int = int(max_cardinality)
    
    gui_root = tk.Tk()
    perturbation_gui(gui_root, working_perts, max_card_int, oscillation, phenotype_string, controllable_string)
    gui_root.mainloop()