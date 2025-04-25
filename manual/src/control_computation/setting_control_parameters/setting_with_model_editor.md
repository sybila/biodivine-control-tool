# Setting Control Settings with the Model Editor

In Aeon, some control settings can be modified not only through dedicated editors but also directly within the Model Editor. This functionality allows for quick adjustments to the Control-Enabled status and phenotype status of variables without switching to separate menus.

Each row in the Model Editor’s variable table includes two buttons, each corresponding to a specific control setting:

- Control-Enabled status Button – Toggles whether the variable is Control-Enabled.
- Phenotype Button – Adjusts the phenotype status of the variable.

## Control-Enabled status Button

The Control-Enabled status Button is represented by a controller icon and is used to toggle the Control-Enabled status of a variable. Clicking on this button changes whether the variable can be included in perturbations. The button also visually indicates the variable's Control-Enabled status through its color:

- Yellow – The variable is Control-Enabled.
- Grey – The variable is Not-Control-Enabled.

![Setting Control-Enabled status Model Editor](../../assets/control_enabled_model_editor.gif)
*Making Control-Enabled variables Not-Control-Enabled using the Model Editor*

## Phenotype Button

The Phenotype Button is represented by a target icon and is used to modify the phenotype status of a variable. Clicking on this button toggles whether the variable is included in the phenotype and, if so, whether it is set to true or false. The button's color visually indicates the variable’s phenotype status:

- Green – The variable is included in the phenotype as true.
- Red – The variable is included in the phenotype as false.
- Gray – The variable is not included in the phenotype.

![Setting Phenotype Model Editor](../../assets/phenotype_model_editor.gif)
*Setting of the phenotype using the Model Editor*