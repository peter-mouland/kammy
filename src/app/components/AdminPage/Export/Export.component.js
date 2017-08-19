import React from 'react';
import Route from 'react-router-dom/Route';
import bemHelper from 'react-bem-helper';
import debug from 'debug';

import fieldSorter from '../../../utils/field-sorter';
import Players from '../../Players/Players';
import join from '../../../utils/joinPath';
import selectedItem from '../../../utils/selectedItem';
import Interstitial from '../../Interstitial/Interstitial';
import AdminList from '../AdminList/AdminList';

const bem = bemHelper({ name: 'export' });
const log = debug('kammy:Export.component');

export default class ExportPage extends React.Component {
  fetchExternalStats = (season, source) => {
    this.props.fetchExternalStats({ currentGW: season.currentGW, source });
  };

  render() {
    const {
      className, seasons, match, seasonUsers,
    } = this.props;
    const seasonPath = join(match.url, ':seasonId/');
    let shownHeader = '';

    if (!seasons) {
      return <Interstitial />;
    }

    return (
      <section { ...bem(null, null, [className])} >
        <AdminList list={ seasons } type="season" secondary />
        <Route
          path={seasonPath} render={(seasonProps) => {
            const season = selectedItem(seasonProps.match, seasons, 'seasonId');
            const teams = seasonUsers.reduce((prev, curr) => prev.concat(curr.teams), []);
            if (!season) return null;
            return (
              <div className="admin-options" >
                <section >
                  {teams
                    .sort(fieldSorter(['division.name', 'user.name']))
                    .map((team) => {
                      const row = (
                        <section key={team.division.name + (team.user.name || team.user.email)}>
                          {
                            shownHeader !== team.division.name && <h3>{team.division.name}</h3>
                          }
                          <Players
                            headerRow={team.user.name || team.user.email}
                            hideOptions={true}
                            team={team}
                            type="admin"
                            showPoints
                          />
                        </section>
                      );
                      shownHeader = team.division.name;
                      return row;
                    })
                  }
                </section>
              </div>
            );
          }}/>
      </section>
    );
  }
}
