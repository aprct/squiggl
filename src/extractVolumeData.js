const getVolumeData = async ( audioData ) => {
  let audioCtx = new ( window.AudioContext || window.webkitAudioContext )();

  const decodedAudioData = await audioCtx.decodeAudioData( audioData );
  const channelData = decodedAudioData.getChannelData( 0 );

  return channelData;
};

export default getVolumeData;
