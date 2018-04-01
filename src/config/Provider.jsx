import React from 'react';
import PropTypes from 'prop-types';
import routes from './routes';

class ConfigProvider extends React.Component {
  constructor(props, state) {
    super(props, state);
    this.appConfig = {
      routes,
    };
  }

  getChildContext() {
    return { appConfig: this.appConfig };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

ConfigProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.string]).isRequired,
};

ConfigProvider.childContextTypes = {
  appConfig: PropTypes.object,
};

export default ConfigProvider;
