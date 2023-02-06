const makeUrl = (path, basePath = process.env.APP_URL) =>
    new URL(path, basePath);

export default makeUrl;
