import debug from 'debug';
import mongoose from 'mongoose';

const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

const log = debug('kammy:db/team.actions');

export const saveNewTeam = (teamData) => {
  const newTeam = new Team(teamData);
  return newTeam.save();
};

export const getTeams = (search = {}) => Team.find(search).exec();

export const getTeam = ({ teamId }, context) => {
  if (!teamId) {
    log({ _id: new ObjectId(context.user._id) });
    return Team.findOne({ 'user._id': new ObjectId(context.user._id) }).exec();
  }
  return Team.findById(teamId).exec();
};

export const updateTeamById = (_id, teamUpdate) =>
  Team.findByIdAndUpdate(_id, teamUpdate, { new: true }).exec();

export const updateTeam = ({ teamUpdate }) => {
  const update = {
    gk: teamUpdate.gk,
    cbleft: teamUpdate.cbleft,
    cbright: teamUpdate.cbright,
    fbleft: teamUpdate.fbleft,
    fbright: teamUpdate.fbright,
    cmleft: teamUpdate.cmleft,
    cmright: teamUpdate.cmright,
    wmleft: teamUpdate.wmleft,
    wmright: teamUpdate.wmright,
    strleft: teamUpdate.strleft,
    strright: teamUpdate.strright,
    sub: teamUpdate.sub,
  };
  return updateTeamById(teamUpdate._id, { $set: update });
};

export const assignTeamToLeague = ({ leagueId, leagueName, teamId }) => {
  const update = { league: { _id: leagueId, name: leagueName } };
  return updateTeamById(teamId, { $set: update });
};
