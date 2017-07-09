import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import { SubLink } from '../../../../app/routes';
import joinPaths from '../../../utils/joinPath';

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
    const { className, list, type, path, children, secondary = false, ...props } = this.props;
    const { router: { route: { match } } } = this.context;
    return (
      <ul
        { ...bem(null, { secondary, [path]: path }, className) }
        { ...props }
        data-test={`admin-list--${type || path}`}
      >
        {
          list
            .map((item, i) => (
              <li { ...bem('item') } key={i}>
                <SubLink
                  { ...bem('text', { [item.path || path]: item.path || path }) }
                  to={joinPaths(match.url, item.path || path, item._id)}
                >
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
