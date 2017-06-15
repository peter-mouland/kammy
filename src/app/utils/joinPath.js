export default (prefix, postfix) =>
  `${prefix}/${postfix}`.replace(/\/\/\//g, '/').replace(/\/\//g, '/');
