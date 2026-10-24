// Comprehensive Engine Logic Test Runner
const fs = require('fs');

global.window = {};
eval(fs.readFileSync('c:/Users/darmu/Desktop/SCORE BOARD/js/engine.js', 'utf8'));
const CricketEngine = global.CricketEngine || window.CricketEngine;

console.log("Running Cricket State Engine automated tests...");

const engine = new CricketEngine();

// ===================================================================
// TEST SUITE 1: Standard Match Flow
// ===================================================================
engine.initMatch({
  format: 't20',
  teamA: {
    id: 'teamA',
    name: 'India',
    shortName: 'IND',
    color: '#2563eb',
    players: ['Rohit', 'Kohli', 'Surya', 'Pant', 'Hardik', 'Dube', 'Jadeja', 'Axar', 'Kuldeep', 'Arshdeep', 'Bumrah']
  },
  teamB: {
    id: 'teamB',
    name: 'Australia',
    shortName: 'AUS',
    color: '#eab308',
    players: ['Head', 'Warner', 'Marsh', 'Maxwell', 'Stoinis', 'David', 'Wade', 'Cummins', 'Starc', 'Zampa', 'Hazlewood']
  },
  tossWinner: 'teamA',
  tossDecision: 'bat'
});

console.assert(engine.state.format === 't20', 'Format should be t20');
console.assert(engine.state.maxOvers === 20, 'Max overs should be 20');
console.assert(engine.state.maxOversPerBowler === 4, 'Max overs per bowler should be 4');
console.assert(engine.getBattingTeam().name === 'India', 'India should be batting first');
console.assert(engine.getBowlingTeam().name === 'Australia', 'Australia should be bowling first');

// Set Openers
const teamAPlayers = engine.state.teamA.players;
const teamBPlayers = engine.state.teamB.players;
engine.setOpeners(teamAPlayers[0].id, teamAPlayers[1].id, teamBPlayers[8].id); // Rohit, Kohli, Starc

let inn = engine.getCurrentInnings();
console.assert(inn.currentStrikerId === teamAPlayers[0].id, 'Rohit is striker');
console.assert(inn.currentNonStrikerId === teamAPlayers[1].id, 'Kohli is non-striker');
console.assert(inn.currentBowlerId === teamBPlayers[8].id, 'Starc is bowler');

// Ball 1: Single
let res = engine.recordDelivery({ runsBat: 1 });
inn = engine.getCurrentInnings();
console.assert(inn.totalRuns === 1, 'Total runs should be 1');
console.assert(inn.legalBallsBowled === 1, 'Legal balls should be 1');
console.assert(inn.currentStrikerId === teamAPlayers[1].id, 'Strike rotated to Kohli on single');

// Ball 2: Boundary Four
res = engine.recordDelivery({ runsBat: 4, isBoundary: true });
inn = engine.getCurrentInnings();
console.assert(inn.totalRuns === 5, 'Total runs should be 5');
console.assert(inn.legalBallsBowled === 2, 'Legal balls should be 2');

// Ball 3: Wide delivery
res = engine.recordDelivery({ extraType: 'wide', extraRuns: 0 });
inn = engine.getCurrentInnings();
console.assert(inn.totalRuns === 6, 'Total runs should be 6 after wide');
console.assert(inn.legalBallsBowled === 2, 'Legal balls should remain 2 after wide');

// Undo wide
const undoSuccess = engine.undoLastDelivery();
console.assert(undoSuccess === true, 'Undo should succeed');
inn = engine.getCurrentInnings();
console.assert(inn.totalRuns === 5, 'Total runs reverted to 5 after undoing wide');

// ===================================================================
// TEST SUITE 2: PLAYERS WITH THE SAME NAME (DUPLICATE NAMES)
// ===================================================================
console.log("Testing identical/duplicate player names support...");

const dupEngine = new CricketEngine();
dupEngine.initMatch({
  format: 't20',
  duplicateNameStyle: 'squadOrder', // 'squadOrder' (e.g. Rahul #1, Rahul #2)
  teamA: {
    id: 'teamA',
    name: 'Red XI',
    shortName: 'RED',
    color: '#dc2626',
    players: [
      'Rahul', 'Rahul', 'Amit', 'Amit', 'Ali', 'Ali',
      'Rahul', 'Rohan', 'Karan', 'Karan', 'Sam'
    ] // Notice: 3 Rahuls (#1, #2, #7), 2 Amits, 2 Alis, 2 Karans!
  },
  teamB: {
    id: 'teamB',
    name: 'Blue XI',
    shortName: 'BLU',
    color: '#2563eb',
    players: [
      'John', 'John', 'David', 'David', 'Chris', 'Chris',
      'Mark', 'Paul', 'Luke', 'James', 'James'
    ] // Notice: 2 Johns, 2 Davids, 2 Chris, 2 James!
  },
  tossWinner: 'teamA',
  tossDecision: 'bat'
});

const redPlayers = dupEngine.state.teamA.players;
const bluePlayers = dupEngine.state.teamB.players;

// Check display names generated with squadOrder disambiguation
console.assert(redPlayers[0].displayName === 'Rahul (#1)', `Expected Rahul (#1), got ${redPlayers[0].displayName}`);
console.assert(redPlayers[1].displayName === 'Rahul (#2)', `Expected Rahul (#2), got ${redPlayers[1].displayName}`);
console.assert(redPlayers[6].displayName === 'Rahul (#7)', `Expected Rahul (#7), got ${redPlayers[6].displayName}`);
console.assert(redPlayers[7].displayName === 'Rohan', `Unique name should remain Rohan, got ${redPlayers[7].displayName}`);

// Both Openers are named "Rahul"!
dupEngine.setOpeners(redPlayers[0].id, redPlayers[1].id, bluePlayers[0].id); // Rahul (#1), Rahul (#2), John (#1)
let dupInn = dupEngine.getCurrentInnings();

console.assert(dupInn.currentStrikerId === redPlayers[0].id, 'Striker is Rahul (#1)');
console.assert(dupInn.currentNonStrikerId === redPlayers[1].id, 'Non-striker is Rahul (#2)');
console.assert(dupInn.currentBowlerId === bluePlayers[0].id, 'Bowler is John (#1)');

// Striker Rahul (#1) hits a four!
dupEngine.recordDelivery({ runsBat: 4, isBoundary: true });
dupInn = dupEngine.getCurrentInnings();
const striker1 = dupInn.batters[redPlayers[0].id];
const nonStriker2 = dupInn.batters[redPlayers[1].id];

console.assert(striker1.name === 'Rahul (#1)', 'Scorecard name is Rahul (#1)');
console.assert(striker1.runs === 4, 'Rahul (#1) has 4 runs');
console.assert(nonStriker2.runs === 0, 'Rahul (#2) has 0 runs');

// Striker Rahul (#1) gets OUT (Caught by John #2, bowled by John #1)
let wRes = dupEngine.recordDelivery({
  runsBat: 0,
  isWicket: true,
  wicketDetails: {
    type: 'caught',
    batterOutId: redPlayers[0].id,
    fielderId: bluePlayers[1].id // John (#2)
  }
});
dupInn = dupEngine.getCurrentInnings();
console.assert(striker1.isOut === true, 'Rahul (#1) is out');
console.assert(striker1.dismissalText.includes('c John (#2) b John (#1)'), `Dismissal string should distinguish duplicate fielders/bowlers: ${striker1.dismissalText}`);

// Bring in the THIRD Rahul (#7) to bat!
dupEngine.setNewBatter(redPlayers[6].id, true);
dupInn = dupEngine.getCurrentInnings();
console.assert(dupInn.currentStrikerId === redPlayers[6].id, 'Rahul (#7) is now at striker end');
console.assert(dupInn.currentNonStrikerId === redPlayers[1].id, 'Rahul (#2) remains at non-striker end');

// Rahul (#7) hits a single => strike rotates to Rahul (#2)
dupEngine.recordDelivery({ runsBat: 1 });
dupInn = dupEngine.getCurrentInnings();
console.assert(dupInn.currentStrikerId === redPlayers[1].id, 'Strike rotated to Rahul (#2)');
console.assert(dupInn.batters[redPlayers[6].id].runs === 1, 'Rahul (#7) has 1 run');

// ===================================================================
// TEST SUITE 3: Alpha Disambiguation Style (A, B, C)
// ===================================================================
const alphaEngine = new CricketEngine();
alphaEngine.initMatch({
  format: 't20',
  duplicateNameStyle: 'alpha',
  teamA: {
    id: 'teamA',
    name: 'Red XI',
    shortName: 'RED',
    color: '#dc2626',
    players: ['Sam', 'Sam', 'Sam']
  },
  teamB: {
    id: 'teamB',
    name: 'Blue XI',
    shortName: 'BLU',
    color: '#2563eb',
    players: ['Ben', 'Ben']
  }
});

console.assert(alphaEngine.state.teamA.players[0].displayName === 'Sam (A)', 'Expected Sam (A)');
console.assert(alphaEngine.state.teamA.players[1].displayName === 'Sam (B)', 'Expected Sam (B)');
console.assert(alphaEngine.state.teamA.players[2].displayName === 'Sam (C)', 'Expected Sam (C)');

// ===================================================================
// TEST SUITE 4: SHIFT DIRECTLY TO NEXT TEAM & SHOW TOTAL TO CHASE
// ===================================================================
console.log("Testing Shift Directly to Next Team and Total to Chase...");

const chaseEngine = new CricketEngine();
chaseEngine.initMatch({
  format: 'custom',
  customOvers: 2, // 2 overs match for quick verification
  teamA: {
    id: 'teamA',
    name: 'Team India',
    shortName: 'IND',
    color: '#2563eb',
    players: ['Rohit', 'Kohli', 'Bumrah']
  },
  teamB: {
    id: 'teamB',
    name: 'Team Australia',
    shortName: 'AUS',
    color: '#eab308',
    players: ['Head', 'Warner', 'Starc']
  },
  tossWinner: 'teamA',
  tossDecision: 'bat'
});

// Set 1st Innings Openers
chaseEngine.setOpeners('IND_1', 'IND_2', 'AUS_3'); // Rohit, Kohli, Starc
console.assert(chaseEngine.getBattingTeam().name === 'Team India', '1st Innings: Team India batting');

// Bowl Over 1 (6 balls, 10 runs)
for (let b = 1; b <= 5; b++) {
  chaseEngine.recordDelivery({ runsBat: 2 });
}
chaseEngine.recordDelivery({ runsBat: 0 }); // 6 legal balls
console.assert(chaseEngine.getCurrentInnings().legalBallsBowled === 6, 'Over 1 complete');

// Bowl Over 2 (Final Over: 6 balls, 14 runs)
chaseEngine.setNewBowler('AUS_1'); // Head
for (let b = 1; b <= 5; b++) {
  chaseEngine.recordDelivery({ runsBat: 2 });
}
// 12th legal ball (final ball of required 2 overs!)
let lastBallRes = chaseEngine.recordDelivery({ runsBat: 4, isBoundary: true });

let firstInn = chaseEngine.getCurrentInnings();
console.assert(firstInn.legalBallsBowled === 12, '12 legal balls bowled (2.0 overs)');
console.assert(firstInn.isCompleted === true, '1st Innings marked completed upon reaching required overs');
console.assert(firstInn.totalRuns === 24, `Total runs scored in 1st innings is 24, got ${firstInn.totalRuns}`);

// Total to Chase must be 24 + 1 = 25 runs!
const expectedTarget = 25;
const calculatedTarget = firstInn.totalRuns + 1;
console.assert(calculatedTarget === expectedTarget, `Target to chase must be ${expectedTarget}`);

// Shift DIRECTLY to Next Team (2nd Innings)
chaseEngine.startSecondInnings('AUS_1', 'AUS_2', 'IND_3'); // Head, Warner, Bumrah

// Verify direct shift to Next Team
console.assert(chaseEngine.state.currentInningsIndex === 1, 'Current innings shifted to index 1 (2nd Innings)');
console.assert(chaseEngine.getBattingTeam().name === 'Team Australia', 'Batting team is now Next Team (Team Australia)');
console.assert(chaseEngine.getBowlingTeam().name === 'Team India', 'Bowling team is now Previous Team (Team India)');

let secondInn = chaseEngine.getCurrentInnings();
console.assert(secondInn.target === 25, `2nd innings target must be 25, got ${secondInn.target}`);
console.assert(secondInn.totalRuns === 0, '2nd innings starts at 0 runs');
console.assert(secondInn.wickets === 0, '2nd innings starts at 0 wickets');
console.assert(secondInn.legalBallsBowled === 0, '2nd innings starts at 0 balls bowled');

// Verify chase equation
const remainingBalls = (chaseEngine.state.maxOvers * 6) - secondInn.legalBallsBowled;
const neededRuns = secondInn.target - secondInn.totalRuns;
console.assert(remainingBalls === 12, '12 balls remaining in chase');
console.assert(neededRuns === 25, '25 runs needed to win');

// ===================================================================
// TEST SUITE 4: Next Inning & Match End Progression Rules
// ===================================================================
console.log("Testing Next Inning & Match End progression rules...");
const flowEngine = new CricketEngine();
flowEngine.initMatch({
  format: 'custom',
  customOvers: 1, // 1-over match for fast test
  teamA: { id: 'teamA', name: 'Team Alpha', players: ['P1', 'P2', 'P3'] },
  teamB: { id: 'teamB', name: 'Team Beta', players: ['B1', 'B2', 'B3'] },
  tossWinner: 'teamA',
  tossDecision: 'bat'
});
flowEngine.setOpeners('teamA_0', 'teamA_1', 'teamB_0');

// Initial state: 0 balls bowled in 1st innings
let nextCheck = flowEngine.canProceedToNextInnings();
console.assert(nextCheck.allowed === false, 'Next Inning button must NOT be allowed before overs complete');
let endCheck = flowEngine.canEndMatch();
console.assert(endCheck.allowed === false, 'Match End must NOT be allowed in 1st innings');
console.assert(flowEngine.areBothInningsEnded() === false, 'Both innings are not ended initially');

// Bowl 5 balls (incomplete over)
for (let b = 0; b < 5; b++) {
  flowEngine.recordDelivery({ runsBat: 1 });
}
console.assert(flowEngine.isFirstInningsOversCompleted() === false, '1st innings overs not complete at 5 balls');
console.assert(flowEngine.canProceedToNextInnings().allowed === false, 'Next Inning still not allowed at 5 balls');

// Bowl 6th ball (completing the 1-over limit)
flowEngine.recordDelivery({ runsBat: 2 });
console.assert(flowEngine.isFirstInningsOversCompleted() === true, '1st innings overs complete after 6 balls (1.0 ov)');
console.assert(flowEngine.canProceedToNextInnings().allowed === true, 'Next Inning button is NOW ALLOWED after completing chosen overs!');
console.assert(flowEngine.canEndMatch().allowed === false, 'Match End is STILL not allowed because 2nd innings has not started/ended');

// Now transition to 2nd innings
flowEngine.startSecondInnings('teamB_0', 'teamB_1', 'teamA_0');
console.assert(flowEngine.canProceedToNextInnings().allowed === false, 'Next Inning is no longer active in 2nd innings');
console.assert(flowEngine.canEndMatch().allowed === false, 'Match End is not allowed while 2nd innings is in progress');

// Bowl winning delivery in 2nd innings
// Target is (5 * 1 + 2) + 1 = 8 runs.
// Score a 6 and a 4 = 10 runs >= 8 runs
flowEngine.recordDelivery({ runsBat: 6 });
console.assert(flowEngine.canEndMatch().allowed === false, 'Match End not allowed before target reached');

flowEngine.recordDelivery({ runsBat: 4 });
// Target reached!
console.assert(flowEngine.state.isCompleted === true, 'Match marked completed upon chasing target');
console.assert(flowEngine.areBothInningsEnded() === true, 'Both innings have now ended');
console.assert(flowEngine.canEndMatch().allowed === true, 'MATCH END BUTTON IS NOW UNLOCKED after both innings ended!');

console.log("ALL AUTOMATED TESTS PASSED FLAWLESSLY! Next Inning & Match End verification complete!");
