## eyeprp

Parser + visualizer for eyeglass prescriptions.

## Dependencies

- C compiler (gcc)
- GNU make
- flex
- bison
- Python 3 (for the local HTTP server used by the visualizer)
- A modern web browser

Windows users: use WSL or MSYS2/MinGW so `make`, `flex`, `bison`, and `python3` are available.

## Build

```bash
make
```

Output binary: `build/eyeprp`

## Run

Parse a file:

```bash
./build/eyeprp examples/presc1.txt
```

Parse from stdin:

```bash
./build/eyeprp < examples/presc1.txt
```

On success, JSON is written to stdout and saved to `prescription.json`.

## Visualizer

After parsing, the program starts a local HTTP server at `http://localhost:8000` and opens the visualizer page. This is done to avoid CORS issues when loading `prescription.json`.

If the server or browser does not open (for example on Windows), you can open the visualizer manually:

```text
http://localhost:8000/visualizer/visualizer.html
```

## Input Format (Quick Guide)

- Sections: `FAR:` and/or `NEAR:`
- Eyes per section: `OD: ...`, `OS: ...`, or `AO: ...` (both eyes)
- Eye parameters: `SPH <num> [CYL <num> AXIS <deg>]`
- Optional fields: `ADD`, `DP`, `NP`, `AV`, `PRISM`

Example:

```text
FAR:
	OD: SPH -1.25 CYL -0.50 AXIS 90
	OS: SPH -1.25 CYL -0.25 AXIS 180
NEAR:
	AO: SPH +1.50
ADD 2.00
DP 63.00
```

## Clean

```bash
make clean
```
