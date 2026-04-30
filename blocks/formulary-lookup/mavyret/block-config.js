export default async function getBlockConfigs() {
  return {
    flags: {
      submitIconEnabled: false,
      autoSubmitOnStateChange: false,
      disclaimerModal: true,
    },
    variations: [],
    decorations: {},
  };
}
