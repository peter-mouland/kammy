/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentMeta from 'react-document-meta';
import { hasWindow } from '../../app/utils';

const Html = ({
  js, css, markup, initialState
}) => (
  <html lang="en">
  <head>
    <meta charSet="utf-8" />
    {hasWindow ? null : DocumentMeta.renderAsReact()}
    <meta httpEquiv="x-dns-prefetch-control" content="on" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  </head>
  <body>
    <div id="stylesheets" dangerouslySetInnerHTML={{ __html: css.join('') }} />
    <script
      id="initial-state"
      dangerouslySetInnerHTML={{
        __html: `window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}`
      }} />
    <div id="html" dangerouslySetInnerHTML={{ __html: markup }} />
    <div id="scripts" dangerouslySetInnerHTML={{ __html: js.join('') }} />
    {/* recommend `google-analytics-debugger` chrome extension for debugging */}
    <script async src="https://www.google-analytics.com/analytics.js"></script>
  </body>
  </html>
);

Html.propTypes = {
  markup: PropTypes.string.isRequired,
  js: PropTypes.arrayOf(PropTypes.string).isRequired,
  css: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Html;
