import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';

import { SubLink, joinPaths } from '../../../app/routes';

import './adminOptions.scss';

const bem = bemHelper({ name: 'user-list' });

class UserAdminOptions extends React.Component {

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    const { children, teams, ...props } = this.props;
    const { router: { route: { match } } } = this.context;
    return (
      <div className="admin-options" { ...props }>
        <div className="admin-option">
              <ul className="simple-list">
                { teams.map((team) => (
                    <li key={team._id}>
                      <SubLink { ...bem('text') } to={joinPaths(match.url, team._id)}>
                        {team.name}
                        <span className="label">{team.user.name}</span>
                        <span className="label--secondary">{team.league.name}</span>
                      </SubLink>
                    </li>)
                )}
              </ul>
        </div>
        <div className="admin-option admin-option__btn">
          { children }
        </div>
      </div>
    );
  }
}

export default UserAdminOptions;
