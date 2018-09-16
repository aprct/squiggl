# squiggl
A javascript library to create a squiggly SVG waveform from audio data.
Inspired by the podcast player by [Megaphone](https://megaphone.fm/).

![Example waveform](./squiggl.png?raw=true "Example")

## Demo
[https://codepen.io/aprct/full/JaaRqX/](https://codepen.io/aprct/full/JaaRqX/)

## Installation

Via `<script>` tag (example):
```html
<script src="https://unpkg.com/squiggl/dist/index.js"></script>
```

Via `npm i squiggl`:
```js
const squiggl = require('squiggl');
// or
import squiggl from 'squiggl';
```

## Usage

The **squiggl** object consists of 3 functions:
* extractVolumeData
* formatVolumeData
* createElement

These functions are used in tandem to:
1. Extract the useful bits of data we need from an audio file.
2. Format the data into a shape that we can use.
3. Create an SVG element that is the visualization of the data.

### Quick Example
```js
// Step 0.1: Define squiggly SVG element's parent container.
var container = document.querySelector( '#waveform-container' );
// Step 0.2: Define options.
const options = {
  svg: {
    id: 'squigglSvg',
    width: 810,
    height: 60
  },
  path: {
    arcRadius: 2.25, // recommended
    stroke: '#eaeaef',
    strokeWidth: 1.2 // recommended
  }
};

fetch( '/radiolab.mp3' )
  // Step 0.3: Retrieve an audio file.
  .then( res => res.arrayBuffer() )
  // Step 1: Extract the useful bits of data we need.
  .then( audioData => squiggl.extractVolumeData( audioData ) )
  .then( volumeData => {
    // Step 2: Format the data into a shape that we can use.
    const formattedVolumeData = squiggl.formatVolumeData( volumeData, options.svg.width, options.path.arcRadius );
    // Step 3: Create an SVG element that is the visualization of the data.
    const svgElement = squiggl.createElement( formatVolumeData, options );

    container.appendChild( svgElement );
  });
```

### Detailed Explanation
#### options
**squiggl** requires you to define certain attributes of its internal `<svg>` and `<path>` elements through the `options` parameter. This allows you to dynamically define certain visual properties of the waveform.
```js
// Example
const options = {
  svg: {
    id: 'squigglSvg',
    width: 810,
    height: 60
  },
  path: {
    arcRadius: 2.25, // recommended
    stroke: '#eaeaef',
    strokeWidth: 1.2 // recommended
  }
};
```
#### extractVolumeData( audioData )
| Parameter | Type | Description |
| --- | --- | --- |
| `audioData` | [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | This is decoded using the `decodeAudioData` function from either [`window.AudioContext` or `window.webkitAudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) (whichever is available). We can then call `getChannelData(0)` from the resulting buffer to pull out the volume data. |

| Returns |
| --- |
| Array of Numbers between -1.0 and 1.0 |

This function doesn't care where you get your audio data from (HTTP request, file input, etc...) as long as it's compatible with the [AudioContext API](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

#### formatVolumeData( volumeData, width, arcRadius )
| Parameter | Type | Description |
| --- | --- | --- |
| `volumeData` | Array of Numbers between -1.0 and 1.0 | Ideally generated from the extractVolumeData function. |
| `width` | Number | The desired width of your SVG. Used to determine how many squiggles to draw. |
| `arcRadius` | Number | The radius of each turn in the waveform. Used to determine how many squiggles to draw. |

| Returns |
| --- |
| Array of Numbers between 0.0 and 1.0 |

This function formats the audio data into a smaller set of numbers that models the number of squiggles in the waveform, and their magnitudes.

#### formatVolumeData( volumeData, options )
| Parameter | Type | Description |
| --- | --- | --- |
| `volumeData` | Array of Numbers between 0.0 and 1.0 | Ideally generated from the formatVolumeData function. |
| `options` | Object | See above. |

| Returns |
| --- |
| An `<svg>` [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) that is ready to be added to the DOM. |

### Responsive Demo
I decided to split the **squiggl** functionality into 3 parts (one async, two sync) so that the audio data can be read once, then re-formatted and re-rendered multiple times without render-blocking I/O. This way, the waveform can be re-rendered in response to changing screen widths.

See the `/demo` directory or [https://codepen.io/aprct/pen/JaaRqX](https://codepen.io/aprct/pen/JaaRqX) for usage that renders a *responsive* waveform.
