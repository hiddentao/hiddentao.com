---
title: Simple 3D graphics engine
---

This is a simple 3D graphics engine I've written in Java 1.5 using the Swing windowing toolkit and parts of the Java2D API. It supports the following features:

* Hierarchical scenegraph including `Mesh`, `Rotation`, `Translation` and `Light` nodes.  
* Triangle primitives with helpers for building cubes  
* UVN camera with orthographic or perspective projection  
* Timer scheduler for animating the scene.  
* Rendering system abstraction  
* Renderers follow `Visitor` design pattern  
* Software-based renderer  
* Wireframe/flat shading  
* Simple directional light  
* Backface culling  
* Pixel-level z-buffer  
* Customizable interaction (i.e. user input) handlers

More information can be found in the [original blog posting](/archives/2010/01/20/3d-demo/).

## Demo

_Ensure you have [Java 1.5+](https://java.com/en/download/help/enable_browser.xml) installed for your browser_.

https://hiddentao.com/kai-engine/

## Download

The source code for this engine is licensed under the [LGPL 3](http://www.gnu.org/copyleft/lesser.html "GNU Lesser General Public License").

Source: [https://github.com/hiddentao/kai-engine](https://github.com/hiddentao/kai-engine)

Build instructions can be found in `README.txt`.
