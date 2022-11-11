# Search algorithm

## Table of contents

- [Overview](#overview)
    - [Challenge](#challenge)
    - [Run project](#run-project)
    - [Repository structure](#repository-structure)
    - [Links](#links)
- [My process](#my-process)
    - [Built with](#built-with)
    - [Next Steps](#next-steps)
- [Author](#author)

## Overview

P7, Part of DA - React OC course

### Challenge

Expected skills :

- Analyze a computer problem
- Develop an algorithm to solve a problem

The main objectives of this project were :

- Set up a feature investigation sheet
- Set up a flowcharts which describes the algorithm
- Set up an interface (HTML/SASS) based on a figma model.
- Dynamic recipes display.
- Create two versions of a main search algorithm:
    - The user enters text
    - display the recipes whose text matches the name, description or one of the ingredients
- Choose the best main search algorithme depending on performance
- Set up additional filtering by tags (utensils, ingredients, appliances)
- The user can start by selecting a tag, by the main search or a combination of both.
- Set up a search in the available tags from user inputs
- Refresh available tags based on displayed recipes

### Repository structure

#main branch contain the first version of the main search algorithm
#native-loops branch contain the second version of the main search algorithm

### Run Project

If you want to run the project locally, make sure you have `nodejs` and `npm` installed and use
these commands.

1. Open you CLI
2. Run ``npm install``
3.
    - ``npm run dev`` run TS in watch mode OR
    - ``npm run tscompil`` compil TS OR
    - ``npm run serve`` compil TS and run a local server. Then you can open your browser with the
      given url

### Links

You can also consult the hosted website : [Live URL](#)

Source code available [Here](https://github.com/TheNewDevl/p7-algo)

## My process

I started by setting up the static interface with HTML and SASS.

Then I set up a feature investigation sheet for the main search and an flowchart to plan the two versions of the
algorithm.

Then I set up the typescript code to make the site dynamic, and the different algorithms.

When everything was functional, I did some tests (benchmarks, browser profiling, etc.).

Finally, I completed the feature investigation sheet and chose the version of the algorithm based on my tests and my
conclusions.

### Built with

- TypeScript
- Classes
- SASS ( CSS pre-processor )
- ESlint

### Next steps

- Testing

## Author

- GitHub - [Carl Dev](https://github.com/TheNewDevl)