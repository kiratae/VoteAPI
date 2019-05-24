const da_users = require('./da_users.js')
const da_cluster = require('./da_cluster.js')
const da_score = require('./da_score.js')
const da_systems = require('./da_systems.js')
const da_user_point_matching = require('./da_user_point_matching.js')
const da_voting_logs = require('./da_voting_logs.js')
const da_vote_time = require('./da_vote_time.js')
const da_user_type = require('./da_user_type.js')

module.exports.da_users = da_users
module.exports.da_cluster = da_cluster
module.exports.da_score = da_score
module.exports.da_systems = da_systems
module.exports.da_user_point_matching = da_user_point_matching
module.exports.da_voting_logs = da_voting_logs
module.exports.da_vote_time = da_vote_time
module.exports.da_user_type = da_user_type

const m_users = require('./m_users.js')
const m_user_type = require('./m_user_type.js')
const m_cluster = require('./m_cluster.js')
const m_score = require('./m_score.js')
const m_systems = require('./m_systems.js')
const m_vote_time = require('./m_vote_time.js')

module.exports.m_users = m_users
module.exports.m_user_type = m_user_type
module.exports.m_cluster = m_cluster
module.exports.m_score = m_score
module.exports.m_systems = m_systems
module.exports.m_vote_time = m_vote_time

// ------------- START scrum -------------------------

const da_event = require('./scrum/da_event.js')
const da_log = require('./scrum/da_log.js')

module.exports.da_event = da_event
module.exports.da_log = da_log

const m_event = require('./scrum/m_event.js')
const m_log = require('./scrum/m_log.js')

module.exports.m_event = m_event
module.exports.m_log = m_log

// ------------- END scrum ---------------------------