import extractVolumeData from './extractVolumeData';
import formatVolumeData from './formatVolumeData';
import createElement from './createElement';

const squiggl = {
  createElement,
  extractVolumeData: async ( audioData ) => extractVolumeData( audioData ),
  formatVolumeData
};

module.exports = squiggl;
