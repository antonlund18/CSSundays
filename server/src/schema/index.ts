import { builder } from "./builder.js";

// Each model folder registers its own types and root fields with the builder.
import "./auth/auth.model.js";
import "./auth/auth.mutations.js";

import "./player/player.model.js";
import "./player/player.queries.js";
import "./player/player.mutations.js";

import "./team/team.model.js";
import "./team/team.queries.js";
import "./team/team.mutations.js";

import "./team-invite/team-invite.model.js";
import "./team-invite/team-invite.queries.js";
import "./team-invite/team-invite.mutations.js";

import "./notification/notification.model.js";
import "./notification/notification.queries.js";
import "./notification/notification.mutations.js";
import "./notification/notification.subscriptions.js";

import "./tournament/tournament.model.js";
import "./tournament/tournament.queries.js";
import "./tournament/tournament.mutations.js";
import "./tournament/tournament.subscriptions.js";

import "./registration/registration.model.js";
import "./registration/registration.queries.js";
import "./registration/registration.mutations.js";
import "./registration/registration.subscriptions.js";

import "./match/match.model.js";
import "./match/match.queries.js";
import "./match/match.mutations.js";
import "./match/match.subscriptions.js";

import "./match-server/match-server.model.js";
import "./match-server/match-server.queries.js";
import "./match-server/match-server.mutations.js";

import "./chat/chat.model.js";
import "./chat/chat.queries.js";
import "./chat/chat.mutations.js";
import "./chat/chat.subscriptions.js";

import "./map/map.model.js";
import "./map/map.queries.js";
import "./map/map.mutations.js";

import "./search/search.model.js";
import "./search/search.queries.js";

export const schema = builder.toSchema({ sortSchema: true });
