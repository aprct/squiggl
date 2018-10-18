import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import squiggl from 'squiggl';
import './App.css';

class App extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      loading: false,
      squiggled: false
    };
  }

  componentDidMount() {
    const container = document.querySelector( '#waveform-container' );
    const renderSquiggl = this.renderSquiggl;

    optimizedResize.add(() => {
      if( container.childNodes.length > 0 ) {
        renderSquiggl();
      }
    });
  }

  getOptions = ( container ) => {
    return {
      svg: {
        id: 'squiggl',
        width: container.offsetWidth,
        height: 60
      },
      path: {
        arcRadius: 2.25,
        stroke: '#eaeaef',
        strokeWidth: 1.2
      }
    };
  }

  handleDrop = () => {
    const container = document.querySelector( '#waveform-container' );
    container.innerHTML = '';

    this.setState({
      loading: true,
      squiggled: false
    });
  }
  handleAcceptedDrop = ( file, event ) => {
    const fileReader = new FileReader();
    fileReader.onload = ( evt ) => {
      const arrayBuffer = evt.target.result;

      this.squigglify( arrayBuffer );
    };
    fileReader.readAsArrayBuffer( file[ 0 ] );
  }

  squigglify = ( arrayBuffer ) => {
    squiggl.extractVolumeData( arrayBuffer )
      .then( volumeData => {
        this.setState({ volumeData }, this.renderSquiggl );
      })
  }
  renderSquiggl = () => {
    const container = document.querySelector( '#waveform-container' );
    const options = this.getOptions( container );
    const formattedVolumeData = squiggl
      .formatVolumeData( this.state.volumeData,
                         options.svg.width,
                         options.path.arcRadius );
    const el = squiggl.createElement( formattedVolumeData, options );

    if( container.childNodes.length > 0 ) {
      container.removeChild( container.childNodes[ 0 ] );
    }
    container.appendChild( el );

    this.setState({
      loading: false,
      squiggled: true
    });
  }

  render() {
    return (
      <div className="App">
        <Dropzone onDrop={ this.handleDrop }
                  accept="audio/*"
                  multiple={ false }
                  disabled={ this.state.loading }
                  onDropAccepted={ this.handleAcceptedDrop }
                  className="Dropzone">
          <header className="App-header">
            <h1>squiggl</h1>
            <p>
              {
                this.state.loading ?
                  'Loading...' :
                  'Try dropping an audio file here, or click anywhere to select an audio file to upload.'
              }
            </p>
            <div id="waveform-container"></div>
            {
              this.state.squiggled &&
              <p>
                Try resizing the window.
              </p>
            }
          </header>
        </Dropzone>

        <a href="https://github.com/aprct/squiggl" target="_blank" rel="noopener noreferrer" className="gh-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16"><path fill="#FFF" fillOpacity="0.7" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        </a>
      </div>
    );
  }
}

/**
 * Responsive code
 */
var optimizedResize = (function() {

  var callbacks = [],
  running = false;

  // fired on resize event
  function resize() {

    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }

  }

  // run the actual callbacks
  function runCallbacks() {

    callbacks.forEach(function(callback) {
      callback();
    });

    running = false;
  }

  // adds callback to loop
  function addCallback(callback) {

    if (callback) {
      callbacks.push(callback);
    }

  }

  return {
    // public method to add additional callback
    add: function(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    }
  }
}());

export default App;
