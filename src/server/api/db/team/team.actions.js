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
    return Team.findOne({ 'user._id': new ObjectId(context.user._id) }).populate('user').exec();
  }
  return Team.findById(teamId).populate('user').exec();
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
    midleft: teamUpdate.midleft,
    midright: teamUpdate.midright,
    amleft: teamUpdate.amleft,
    amright: teamUpdate.amright,
    strleft: teamUpdate.strleft,
    strright: teamUpdate.strright,
    sub: teamUpdate.sub,
  };
  return updateTeamById(teamUpdate._id, { $set: update });
};

export const assignTeamToDivision = ({ divisionId, divisionName, teamId }) => {
  const update = { division: { _id: divisionId, name: divisionName } };
  return updateTeamById(teamId, { $set: update });
};
