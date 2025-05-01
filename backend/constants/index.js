const ROLE = {
  USER: "user",
  PLAYER: "player",
  SPONSOR: "sponsor",
  ORGANIZER: "organizer",
  REFEREE: "referee",
  REFEREE_MANAGER: "referee_manager",
  ADMIN: "admin",
  SPECTATOR: "spectator",
};

const REGISTRATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const TOURNAMENT_STATUS = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const COURT_SURFACE = {
  HARD: "hard",
  CLAY: "clay",
  GRASS: "grass",
  ARTIFICIAL: "artificial",
};

const COURT_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  MAINTENANCE: "maintenance",
};

const INCIDENT_STATUS = {
  PENDING: "pending",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
};

const INCIDENT_TYPE = {
  INCIDENT: "incident",
  WARNING: "warning",
  PENALTY: "penalty",
};

const THEME_BG = ["BLUE", "GREEN", "PURPLE", "ORANGE", "PINK"];

const SCORE_TABLE = {
  0: 0,
  1: 15,
  2: 30,
  3: 40,
  4: 50,
  5: 60,
};

module.exports = {
  ROLE,
  REGISTRATION_STATUS,
  TOURNAMENT_STATUS,
  MATCH_STATUS,
  COURT_SURFACE,
  COURT_STATUS,
  INCIDENT_STATUS,
  INCIDENT_TYPE,
  THEME_BG,
  SCORE_TABLE,
};
