# Biodivine/Aeon Online Tool Client

The Aeon Client is a web-based user interface for the Aeon tool, designed for Boolean network operations. This project includes a static HTML+JS website for easy deployment and use.

## Getting Started
### Running the GUI Locally
1) Download the repository contents.

2) Open a terminal in the project directory.

3) Run the following command to start a local server:
    
        python3 -m http.server 8080

4) Open your browser and navigate to: http://localhost:8080.


### Deploying on a Server

To host the GUI on your server:
1) Copy all files from the repository to the desired directory.

2) Configure your server to serve these files as a static website.

## AEON WASM Integration

Some features rely on a WebAssembly (WASM) library, located in the aeon-wasm folder. This library exports native AEON functionalities, avoiding the need for re-implementation in JavaScript.

Ensure the aeon-wasm folder is included when deploying the GUI, as it is critical for WASM functionality.

### Rebuilding the WASM Package

If you modify the code in aeon-wasm/src/, follow these steps to rebuild the package:
1) Navigate to the aeon-wasm folder.

2) Run:

        wasm-pack build --target web

3) The updated package will be automatically detected by the main JS project.

