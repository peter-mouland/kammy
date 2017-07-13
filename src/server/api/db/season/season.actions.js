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

export const getDivisions = async () => {
  const season = await Seasons.findOne({ isLive: true }).sort({ dateCreated: -1 }).exec();
  const divisions = season.divisions;
  const $in = divisions.map((division) => new ObjectId(division._id));
  const aggFields = {
    'total.cb': { $add: ['$total.cbleft', '$total.cbright'] },
    'total.fb': { $add: ['$total.fbleft', '$total.fbright'] },
    'total.cm': { $add: ['$total.cmleft', '$total.cmright'] },
    'total.wm': { $add: ['$total.wmleft', '$total.wmright'] },
    'total.str': { $add: ['$total.strleft', '$total.strright'] },
    'total.points': { $add: ['$total.cbleft', '$total.cbright', '$total.fbleft', '$total.fbright', '$total.cmleft', '$total.cmright', '$total.wmleft', '$total.wmright', '$total.strleft', '$total.strright'] },
    'gameWeek.cb': { $add: ['$gameWeek.cbleft', '$gameWeek.cbright'] },
    'gameWeek.fb': { $add: ['$gameWeek.fbleft', '$gameWeek.fbright'] },
    'gameWeek.cm': { $add: ['$gameWeek.cmleft', '$gameWeek.cmright'] },
    'gameWeek.wm': { $add: ['$gameWeek.wmleft', '$gameWeek.wmright'] },
    'gameWeek.str': { $add: ['$gameWeek.strleft', '$gameWeek.strright'] },
    'gameWeek.points': { $add: ['$gameWeek.cbleft', '$gameWeek.cbright', '$gameWeek.fbleft', '$gameWeek.fbright', '$gameWeek.cmleft', '$gameWeek.cmright', '$gameWeek.wmleft', '$gameWeek.wmright', '$gameWeek.strleft', '$gameWeek.strright'] },
  };
  // only works in mongo 3.4
  // const teams = await Teams.aggregate(
  //   { $match: { 'division._id': { $in } } }, { $addFields: aggFields }
  // ).exec();
  // for mongo 3.2
  // helped: https://stackoverflow.com/questions/42394902/mongoose-how-to-use-aggregate-and-find-together/42395156
  aggFields.season = 1; // show season in agg query response.
  aggFields.user = 1;
  aggFields['total.gk'] = 1;
  aggFields['total.sub'] = 1;
  aggFields['gameWeek.gk'] = 1;
  aggFields['gameWeek.sub'] = 1;
  aggFields.division = 1;
  // end workaround
  const teams = await Teams.aggregate(
    { $match: { 'division._id': { $in } } }, { $project: aggFields }
  ).exec();
  log(teams);
  return divisions.map((division) => ({
    tier: division.tier,
    _id: division._id,
    name: division.name,
    teams: teams.filter((team) => team.division._id !== division._id)
  }));
};

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

