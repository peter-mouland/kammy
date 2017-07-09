import React from 'react';
import PropTypes from 'prop-types';
import bemHelper from 'react-bem-helper';
import Route from 'react-router-dom/Route';

import { SubLink, joinPaths } from '../../../app/routes';
import TeamAdminOptions from '../../components/Admin/TeamAdminOptions';

import './adminOptions.scss';

const bem = bemHelper({ name: 'admin-options' });

class DivisionAdminOptions extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    division: PropTypes.object,
  }

  render() {
    const { teams, children, saveUpdates, ...props } = this.props;
    const { router: { route: { match } } } = this.context;
    return (
      <div
        {...bem(null, 'top') }
        { ...props }
        data-test="admin-options--division"
      >
        <div className="admin-option">
          <ul className="simple-list">
            { teams.map((team) => {
              const teamPath = joinPaths(match.url, 'team', team._id);
              return (
                <li key={team._id}>{team.name}
                  <SubLink { ...bem('text') } to={teamPath}>
                    {team.user.name}
                  </SubLink>
                  <Route
                    path={teamPath} render={() => (
                      <TeamAdminOptions team={ team } saveUpdates={ saveUpdates } />
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

export default DivisionAdminOptions;
