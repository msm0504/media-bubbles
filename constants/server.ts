export const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
export const MILLISECONDS_IN_FIFTEEN_MIN = 1000 * 60 * 15;
export const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
export const useBiasRatingsFile = process.env.USE_BIAS_RATINGS_FILE === 'true';
