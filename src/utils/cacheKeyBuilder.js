const buildCacheKey = (...args) => args.join(':');

export default buildCacheKey;