import debug from 'debug';

const log = debug('kammy:db/season.actions');

const mongoose = require('mongoose');

const Seasons = mongoose.model('Season');
const Teams = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

export const findSeasonById = (_id) => Seasons.findById(_id).exec();

export const getSeasons = (search = {}) => {
  const query = Object.keys(search).length > 0
    ? Seasons.findOne(search)
    : Seasons.find(search);
  return query.sort({ dateCreated: -1 }).exec();
};

export const getDivisions = () => Seasons
  .findOne({ isLive: true })
  .sort({ dateCreated: -1 })
  .exec()
  .then((season) => {
    const divisions = season.divisions;
    const $in = divisions.map((division) => new ObjectId(division._id));
    return Teams.find({ 'division._id': { $in } }).exec().then((teams) => [divisions, teams]);
  })
  .then(([divisions, teams]) => divisions.map((division) => ({
    tier: division.tier,
    _id: division._id,
    name: division.name,
    teams: teams.filter((team) => team.division._id !== division._id)
  })));

export const getLatestSeason = () => Seasons.findOne({}).sort({ dateCreated: -1 }).exec();

export const addSeason = ({ name }) => {
  const newSeason = new Seasons({ name });
  return newSeason.save();
};

export const updateSeasonById = (_id, seasonUpdate) =>
  Seasons.findByIdAndUpdate(_id, seasonUpdate, { new: true }).exec();

export const addDivision = ({ seasonId, name }) => (
  updateSeasonById(seasonId, { $push: { divisions: { name } } })
    .then((season) => season.divisions.find((division) => division.name === name))
);

export const updateSeason = ({ seasonId, isLive, currentGW }) => {
  const update = { };
  if (typeof isLive === 'boolean') update.isLive = isLive;
  if (currentGW) update.currentGW = currentGW;
  return (
    updateSeasonById(seasonId, { $set: update })
  );
};

