# Chloropeth Map
## Overview
Chloropeth Map build dinamically with JavaScript D3 library and fetched JSON data!
![Screenshot_11](https://github.com/Maruku98/Chloropeth-Map/assets/133391272/200aadd4-c9e1-461f-9909-311ebf1810c3)


## PROGRAMMING LANGUAGES USED
- **HTML5**
- **CSS3**
- **JavaScript ES6**
- **D3 Library** 📚:

### EXPLANATION
- Data is fetched with `async-await` syntax from two GitHub raw files. They are then parsed as JSON and stored in the variables `educationData` and `countyData`.
- The JSON data represent the education data from US (percentage of adults age 25 and older with a bachelor's degree or higher between 2010 and 2014), and the county data to build the map (TopoJSON).
- Orange color treshold is achieved with `d3.scaleThreshold()` method.
- TopoJSON data is parsed by `d3.geoPath()` method.
- `d3.min()` and `d3.max()` are used to find the minimum and maximum values within the fetched data.
- A `tooltip` appears with further information as the user hovers over the different counties.
