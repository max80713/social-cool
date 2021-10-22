import algoliasearch from 'algoliasearch';

const client = algoliasearch('TRX8F3KL2G', '4702f48721ccd08cbc93d2779de42fd9');

const algolia = client.initIndex('socialcool');

export default algolia;
