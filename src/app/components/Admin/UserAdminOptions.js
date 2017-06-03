import React from 'react';

import './adminOptions.scss';

class UserAdminOptions extends React.Component {

  render() {
    const { children, teams, ...props } = this.props;
    return (
      <div className="admin-options" { ...props }>
        <div className="admin-option">
              <ul className="simple-list">
                { teams.map((team) => (
                    <li key={team._id}>
                      {team.name}
                      <span className="label">{team.user.name}</span>
                      <span className="label--secondary">{team.league.name}</span>
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
