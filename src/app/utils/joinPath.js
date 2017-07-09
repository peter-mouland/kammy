export default (prefix, path, postfix) =>
  `${[prefix, path, postfix || '']
    .filter((i) => i)
    .join('/')
  }/`.replace(/\/\/\//g, '/').replace(/\/\//g, '/');
