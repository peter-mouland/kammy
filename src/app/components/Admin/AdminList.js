import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import { SubLink, joinPaths } from '../../../app/routes';

import './adminList.scss';

const bem = bemHelper({ name: 'admin-list' });

class AdminList extends React.Component {

  static propTypes = {
    list: PropTypes.array,
    secondary: PropTypes.bool,
  }

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { list, path, children, secondary = false, ...props } = this.props;
    const { router: { route: { match } } } = this.context;
    return (
      <ul { ...bem(null, { secondary, [path]: path }) }
          { ...props }
          data-test={`admin-list--${path}`}
      >
        {
          list
            .map((item, i) => (
              <li { ...bem('item') } key={i}>
                <SubLink { ...bem('text') } to={joinPaths(match.url, path, item._id)}>
                  {item.name}
                </SubLink>
              </li>
            ))
        }
        <li { ...bem('item') }>
          { children }
        </li>
      </ul>
    );
  }
}

export default AdminList;
