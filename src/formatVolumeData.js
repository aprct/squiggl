const formatVolumeData = ( volumeData, width, arcRadius ) => {
    const formattedVolumeData = getBuckets( volumeData, width, arcRadius );
    const scaledVolumeData = scaleVolumeData( formattedVolumeData );

    return scaledVolumeData;
};

/**
 * Credit to Ken Hoff at https://getstream.io/blog/generating-waveforms-for-podcasts-in-winds-2-0/
 */
const getBuckets = ( volumeData, width, arcRadius ) => {
  const bucketCount = Math.floor( width / ( 2 * arcRadius ) );
  const bucketDataSize = Math.floor( volumeData.length / bucketCount );

  let buckets = [];
  for (var i = 0; i < bucketCount; i++) {
    let startingPoint = i * bucketDataSize;
    let endingPoint = i * bucketDataSize + bucketDataSize;
    let max = 0;
    for (var j = startingPoint; j < endingPoint; j++) {
      if (volumeData[j] > max) {
          max = volumeData[j];
      }
    }
    let size = Math.abs(max);
    buckets.push(size / 2);
  }

  return buckets;
};

const scaleVolumeData = ( volumeData ) => {
  const max = Math.max( ...volumeData );
  const scaledVolumeData = volumeData.map( d => d / max );

  return scaledVolumeData;
};

export default formatVolumeData;
