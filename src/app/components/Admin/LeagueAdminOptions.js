import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';
import Route from 'react-router-dom/Route';

import { SubLink, joinPaths } from '../../../app/routes';

import './adminOptions.scss';

const bem = bemHelper({ name: 'admin-options' });
const positions = ['gk', 'cbleft', 'cbright', 'fbleft', 'fbright', 'wmleft', 'wmright', 'cmleft', 'cmright', 'strleft', 'strright', 'sub'];

class LeagueAdminOptions extends React.Component {

  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    league: PropTypes.object,
  }

  render() {
    const { teams, children, ...props } = this.props;
    const { router: { route: { match } } } = this.context;

    return (
      <div {...bem(null, 'top') } { ...props }>
        <div className="admin-option">
          <ul className="simple-list">
            { teams.map((team) => {
              const teamPath = joinPaths(match.url, 'team', team._id);
              return (
                <li key={team._id}>{team.name}
                  <SubLink { ...bem('text') } to={teamPath}>
                    {team.user.name}
                  </SubLink>
                  <Route path={teamPath} render={() => (
                    <ul>
                      {positions.map((pos) => (
                        <li key={pos}>
                          <strong>{pos}</strong> {team[pos].name || <em>unknown</em>}
                        </li>
                      ))}
                    </ul>
                  )} />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="admin-option admin-option__btn">
          { children }
        </div>
      </div>
    );
  }
}

export default LeagueAdminOptions;
