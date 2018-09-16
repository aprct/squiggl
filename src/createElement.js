const createElement = ( volumeData, options ) => {
  const path = getPath( volumeData, { ...options.path, height: options.svg.height } );
  let svg = getSvg( options.svg, options.path.arcRadius );
  svg.appendChild( path );

  return svg;
};

/**
 * <svg>
 */

const getSvg = ( svgOptions, arcRadius ) => {
  const { id, width, height } = svgOptions;
  const viewBox = getViewBox( width, height, arcRadius );

  let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
  svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' );
  svg.setAttribute( 'version', '1.1' );
  svg.setAttribute( 'id', id );
  svg.setAttribute( 'width', width );
  svg.setAttribute( 'height', height );
  svg.setAttribute( 'viewBox', viewBox );

  return svg;
};

const getViewBox = ( width, height, arcRadius ) => {
  const w = width + ( 8 * arcRadius );

  return `0 0 ${ w } ${ height }`;
};

const getPath = ( volumeData, pathOptions ) => {
  const { arcRadius, stroke, strokeWidth, height } = pathOptions;
  const d = drawPath( volumeData, arcRadius, strokeWidth, height );

  let path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
  path.setAttribute( 'fill', 'none' );
  path.setAttribute( 'stroke', stroke );
  path.setAttribute( 'stroke-width', strokeWidth );
  path.setAttribute( 'd', d );

  return path;
};

/**
 * <path>
 */

const drawPath = ( volumeData, arcRadius, strokeWidth, height ) => {
  const midY = height / 2;
  const ceilStrokeWidth = Math.ceil( strokeWidth );

  const prefix = `M 0 ${ midY } ` +
                 `L 0 ${ midY } ` +
                 `A ${ arcRadius } ${ arcRadius } 0 0 0 ${ arcRadius * 2 } ${ midY } ` +
                 `A ${ arcRadius } ${ arcRadius } 0 0 1 ${ arcRadius * 4 } ${ midY } `;

  const suffix = ` L ${ ( volumeData.length + 2 ) * ( arcRadius * 2 )  } ${ midY } ` +
                 `A ${ arcRadius } ${ arcRadius } 0 0 ${ volumeData.length % 2 === 0 ? 0 : 1 } ${ ( volumeData.length + 3 ) * arcRadius * 2 } ${ midY } ` +
                 `A ${ arcRadius } ${ arcRadius } 0 0 ${ volumeData.length % 2 === 0 ? 1 : 0 } ${ ( volumeData.length + 4 ) * arcRadius * 2 } ${ midY }`;

  const path = volumeData.map(( m, i ) => {
    const mod = i % 2 === 0;
    // ( midY - 2 ) because it needs to be less than midY if the stroke width > 1. So for stroke width of 1.2 we take ( midY - ceil( strokeWidth ) ).
    const h = mod ? midY + ( m * ( midY - 2 ) ) : midY - ( m * ( midY - ceilStrokeWidth ) );
    const L = `L ${ ( i + 2 ) * arcRadius * 2 } ${ h }`;
    const A = `A ${ arcRadius } ${ arcRadius } 0 0 ${ mod ? 0 : 1 } ${ ( i + 3 ) * arcRadius * 2 } ${ h }`;
    return `${ L } ${ A }`;
  }).join(' ');

  return prefix + path + suffix;
};

export default createElement;
