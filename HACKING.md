# Hacking

## Nodes
The base architecture of CMC (excluding everything that doesn't directly or indirectly interact with network data) consists of "nodes", unidirectional items through which data flows. Nodes may be connected in different ways, allowing easy modularization.

### Overview
The core function of a Node is to allow events to flow in a nonlinear (yet top-down) fashion. to this effect, the most important function is connect, with which you can connect one node to another. Nodes are typically connected in a top-to-bottom stack (so there may be offshoots, but no loops) but loops are allowable if significant care is taken to avoid endless recursion. E.G. an AppendNode may hook into the client output to append text, but should then be careful to avoid triggering itself again.
A node may emit many kinds of events. It's children may define the wanted_events property as an array of strings, and must also define a handleEvent function for each event in the array (e.g. if the node defines Data and GMCP as events, it must have handleData and handleGMCP as functions). The data event is subscribed to by all nodes unless explicitly changed by defining wanted_events manually.

### The Series and Parallel Functions
The series and parallel functions allow nodes to be easily connected together. The series function, when given a list of node arguments, connects nodes one after another and returns the last one. The parallel function, when given a list of nodes, connects all the nodes to the connector and returns the connector.
These functions, along with correctly defining events, allow easy "control flow" for data.
