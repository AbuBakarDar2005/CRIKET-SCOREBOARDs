// Cricket Scoreboard State Engine
class CricketEngine {
  constructor() {
    this.state = null;
    this.historyStack = []; // Snapshots for deep undo
  }

  // Initialize a new match
  initMatch(config) {
    const {
      format = 't20',
      customOvers = 20,
      teamA = { name: 'Team A', shortName: 'TMA', color: '#2563eb', players: [] },
      teamB = { name: 'Team B', shortName: 'TMB', color: '#dc2626', players: [] },
      tossWinner = 'teamA',
      tossDecision = 'bat', // 'bat' or 'bowl'
      maxOversPerBowler = null,
      duplicateNameStyle = 'squadOrder' // 'squadOrder', 'alpha', 'exact'
    } = config;

    let maxOvers = 20;
    if (format === 't20') maxOvers = 20;
    else if (format === 'odi') maxOvers = 50;
    else if (format === 'test') maxOvers = 999;
    else if (format === 'custom') maxOvers = parseInt(customOvers, 10) || 20;

    const bowlerLimit = maxOversPerBowler 
      ? parseInt(maxOversPerBowler, 10) 
      : (format === 'test' ? 999 : Math.max(1, Math.ceil(maxOvers / 5)));

    // Ensure 11 default players if empty, and support identical/duplicate player names
    const ensurePlayers = (players, prefix) => {
      let rawList = [];
      if (players && players.length > 0) {
        rawList = players.map((p, idx) => {
          const rawName = (typeof p === 'string' ? p : p.name || `${prefix} Player ${idx + 1}`).trim();
          return {
            id: `${prefix}_${idx + 1}`,
            squadNumber: idx + 1,
            name: rawName
          };
        });
      } else {
        for (let i = 1; i <= 11; i++) {
          rawList.push({
            id: `${prefix}_${i}`,
            squadNumber: i,
            name: `${prefix} Player ${i}`
          });
        }
      }

      // Count occurrences of each name in the squad
      const nameCounts = {};
      rawList.forEach(p => {
        const key = p.name.toLowerCase();
        nameCounts[key] = (nameCounts[key] || 0) + 1;
      });

      // Track duplicate occurrence index for each duplicate name
      const duplicateOccurrences = {};
      return rawList.map(p => {
        const key = p.name.toLowerCase();
        const isDuplicate = nameCounts[key] > 1;
        let displayName = p.name;

        if (isDuplicate) {
          duplicateOccurrences[key] = (duplicateOccurrences[key] || 0) + 1;
          const occNum = duplicateOccurrences[key];

          if (duplicateNameStyle === 'alpha') {
            displayName = `${p.name} (${String.fromCharCode(64 + occNum)})`;
          } else if (duplicateNameStyle === 'exact') {
            displayName = p.name;
          } else {
            // Default: squadOrder (e.g. Rahul #1, Rahul #7)
            displayName = `${p.name} (#${p.squadNumber})`;
          }
        }

        // Selector label displayed in dropdowns (always shows squad # for unambiguous choice)
        const selectorLabel = `#${p.squadNumber}. ${displayName}`;

        return {
          ...p,
          displayName,
          selectorLabel,
          isDuplicateName: isDuplicate
        };
      });
    };

    const teamAPlayers = ensurePlayers(teamA.players, teamA.shortName || 'TMA');
    const teamBPlayers = ensurePlayers(teamB.players, teamB.shortName || 'TMB');

    // Determine who bats first
    let firstBattingTeamId = 'teamA';
    if (tossWinner === 'teamA') {
      firstBattingTeamId = tossDecision === 'bat' ? 'teamA' : 'teamB';
    } else {
      firstBattingTeamId = tossDecision === 'bat' ? 'teamB' : 'teamA';
    }
    const firstBowlingTeamId = firstBattingTeamId === 'teamA' ? 'teamB' : 'teamA';

    this.state = {
      id: 'match_' + Date.now(),
      createdAt: Date.now(),
      format,
      maxOvers,
      maxOversPerBowler: bowlerLimit,
      teamA: { ...teamA, players: teamAPlayers },
      teamB: { ...teamB, players: teamBPlayers },
      toss: { winner: tossWinner, decision: tossDecision },
      currentInningsIndex: 0,
      isCompleted: false,
      resultText: '',
      isFreeHit: false, // next ball is a free hit
      innings: [
        this.createInningsState(firstBattingTeamId, firstBowlingTeamId, 1, null),
        this.createInningsState(firstBowlingTeamId, firstBattingTeamId, 2, null)
      ]
    };

    this.historyStack = [];
    return this.state;
  }

  // Load existing match state
  loadState(savedState) {
    this.state = savedState;
    this.historyStack = [];
  }

  createInningsState(battingTeamId, bowlingTeamId, inningsNum, target = null) {
    return {
      inningsNum,
      battingTeamId,
      bowlingTeamId,
      totalRuns: 0,
      wickets: 0,
      legalBallsBowled: 0,
      target: target, // set for 2nd innings
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
        penalty: 0,
        total: 0
      },
      currentStrikerId: null,
      currentNonStrikerId: null,
      currentBowlerId: null,
      previousBowlerId: null,
      batters: {}, // playerId -> stats
      bowlers: {}, // playerId -> stats
      deliveries: [], // all deliveries in innings
      currentOverDeliveries: [], // deliveries in current over
      oversSummary: [], // completed over objects
      fallOfWickets: [], // [{ wicket, score, overs, batterName }]
      partnerships: [], // [{ batter1Id, batter2Id, runs, balls }]
      currentPartnership: { runs: 0, balls: 0, batter1Id: null, batter2Id: null },
      isCompleted: false
    };
  }

  getCurrentInnings() {
    if (!this.state) return null;
    return this.state.innings[this.state.currentInningsIndex];
  }

  getBattingTeam() {
    const innings = this.getCurrentInnings();
    if (!innings) return null;
    return innings.battingTeamId === 'teamA' ? this.state.teamA : this.state.teamB;
  }

  getBowlingTeam() {
    const innings = this.getCurrentInnings();
    if (!innings) return null;
    return innings.bowlingTeamId === 'teamA' ? this.state.teamA : this.state.teamB;
  }

  getPlayer(playerId) {
    if (!this.state || !playerId) return null;
    const allPlayers = [...this.state.teamA.players, ...this.state.teamB.players];
    return allPlayers.find(p => p.id === playerId) || { id: playerId, name: 'Unknown Player', displayName: 'Unknown Player', selectorLabel: 'Unknown Player' };
  }

  // Initialize or get batter stats
  getOrCreateBatter(playerId) {
    const innings = this.getCurrentInnings();
    if (!innings.batters[playerId]) {
      const player = this.getPlayer(playerId);
      innings.batters[playerId] = {
        id: playerId,
        name: player.displayName || player.name,
        rawName: player.name,
        squadNumber: player.squadNumber,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: '0.00',
        isOut: false,
        dismissalText: 'Not Out',
        status: 'batting' // 'batting', 'out', 'retired'
      };
    }
    return innings.batters[playerId];
  }

  // Initialize or get bowler stats
  getOrCreateBowler(playerId) {
    const innings = this.getCurrentInnings();
    if (!innings.bowlers[playerId]) {
      const player = this.getPlayer(playerId);
      innings.bowlers[playerId] = {
        id: playerId,
        name: player.displayName || player.name,
        rawName: player.name,
        squadNumber: player.squadNumber,
        legalBalls: 0,
        oversFormatted: '0.0',
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        noBalls: 0,
        wides: 0,
        economy: '0.00'
      };
    }
    return innings.bowlers[playerId];
  }

  // Set opening batsmen and bowler
  setOpeners(strikerId, nonStrikerId, bowlerId) {
    this.saveSnapshot();
    const innings = this.getCurrentInnings();
    innings.currentStrikerId = strikerId;
    innings.currentNonStrikerId = nonStrikerId;
    innings.currentBowlerId = bowlerId;

    this.getOrCreateBatter(strikerId);
    this.getOrCreateBatter(nonStrikerId);
    this.getOrCreateBowler(bowlerId);

    innings.currentPartnership = {
      batter1Id: strikerId,
      batter2Id: nonStrikerId,
      runs: 0,
      balls: 0
    };
  }

  // Set next bowler (after over completion)
  setNewBowler(bowlerId) {
    const innings = this.getCurrentInnings();
    // Cannot bowl consecutive overs
    if (innings.previousBowlerId && innings.previousBowlerId === bowlerId && innings.bowlingTeamId) {
      const availableBowlers = this.getAvailableBowlers();
      if (availableBowlers.length > 1) {
        throw new Error('A bowler cannot bowl two consecutive overs.');
      }
    }
    innings.currentBowlerId = bowlerId;
    this.getOrCreateBowler(bowlerId);
  }

  // Set new batter after dismissal
  setNewBatter(newBatterId, takesStrike = false) {
    const innings = this.getCurrentInnings();
    this.getOrCreateBatter(newBatterId);

    if (takesStrike) {
      innings.currentStrikerId = newBatterId;
    } else {
      innings.currentNonStrikerId = newBatterId;
    }

    // Start fresh partnership
    innings.currentPartnership = {
      batter1Id: innings.currentStrikerId,
      batter2Id: innings.currentNonStrikerId,
      runs: 0,
      balls: 0
    };
  }

  // Swap strike manually (e.g. if umpire miscall)
  swapStrike() {
    this.saveSnapshot();
    const innings = this.getCurrentInnings();
    const temp = innings.currentStrikerId;
    innings.currentStrikerId = innings.currentNonStrikerId;
    innings.currentNonStrikerId = temp;
  }

  // Save state for undo functionality
  saveSnapshot() {
    if (this.historyStack.length > 100) {
      this.historyStack.shift();
    }
    this.historyStack.push(JSON.stringify(this.state));
  }

  // Undo the last delivery
  undoLastDelivery() {
    if (this.historyStack.length === 0) return false;
    const lastStateJson = this.historyStack.pop();
    this.state = JSON.parse(lastStateJson);
    return true;
  }

  canUndo() {
    return this.historyStack.length > 0;
  }

  // Core Scoring Engine: Record a Ball
  recordDelivery(ballConfig) {
    this.saveSnapshot();

    const innings = this.getCurrentInnings();
    const {
      runsBat = 0,             // runs scored by batter off bat
      extraType = null,        // 'wide', 'noBall', 'bye', 'legBye', 'penalty'
      extraRuns = 0,           // extra runs (wide + runs, bye runs, etc)
      isWicket = false,
      wicketDetails = null,    // { type, batterOutId, fielderId, isStrikerOut, crossed }
      isBoundary = false       // explicit boundary flag (4 or 6)
    } = ballConfig;

    const striker = this.getOrCreateBatter(innings.currentStrikerId);
    const nonStriker = this.getOrCreateBatter(innings.currentNonStrikerId);
    const bowler = this.getOrCreateBowler(innings.currentBowlerId);

    const isWide = extraType === 'wide';
    const isNoBall = extraType === 'noBall';
    const isBye = extraType === 'bye';
    const isLegBye = extraType === 'legBye';
    const isPenalty = extraType === 'penalty';
    const isLegalBall = !isWide && !isNoBall && !isPenalty;

    let deliveryRunsTotal = runsBat + extraRuns;
    if (isWide || isNoBall) {
      // 1 penalty run for wide or no ball + any additional runs
      deliveryRunsTotal += 1;
    }

    // 1. Update Team Runs
    innings.totalRuns += deliveryRunsTotal;

    // 2. Update Extras
    if (isWide) {
      const wideTotal = 1 + extraRuns;
      innings.extras.wides += wideTotal;
      innings.extras.total += wideTotal;
      bowler.wides += 1;
      bowler.runsConceded += wideTotal;
    } else if (isNoBall) {
      innings.extras.noBalls += 1;
      innings.extras.total += 1;
      bowler.noBalls += 1;
      // Batter gets credit for runs scored off the bat on a no-ball!
      bowler.runsConceded += (1 + runsBat + extraRuns);
    } else if (isBye) {
      innings.extras.byes += extraRuns;
      innings.extras.total += extraRuns;
      // Byes do NOT count against the bowler
    } else if (isLegBye) {
      innings.extras.legByes += extraRuns;
      innings.extras.total += extraRuns;
      // Leg byes do NOT count against the bowler
    } else if (isPenalty) {
      innings.extras.penalty += extraRuns;
      innings.extras.total += extraRuns;
    } else {
      // Regular delivery off bat
      bowler.runsConceded += runsBat;
    }

    // 3. Update Batter Stats
    if (isLegalBall || isNoBall) {
      striker.balls += 1; // Wides do not count as a ball faced
    }
    if (!isBye && !isLegBye && !isWide) {
      striker.runs += runsBat;
      if (runsBat === 4 || (isBoundary && runsBat === 4)) {
        striker.fours += 1;
      } else if (runsBat === 6 || (isBoundary && runsBat === 6)) {
        striker.sixes += 1;
      }
    }
    striker.strikeRate = striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.00';

    // 4. Update Bowler Stats
    if (isLegalBall) {
      bowler.legalBalls += 1;
      innings.legalBallsBowled += 1;
    }
    bowler.oversFormatted = this.formatOvers(bowler.legalBalls);
    bowler.economy = bowler.legalBalls > 0 
      ? ((bowler.runsConceded / bowler.legalBalls) * 6).toFixed(2) 
      : '0.00';

    // 5. Update Partnership
    innings.currentPartnership.runs += deliveryRunsTotal;
    if (isLegalBall) {
      innings.currentPartnership.balls += 1;
    }

    // 6. Handle Wickets
    let wicketRecorded = false;
    let nextBatterPromptNeeded = false;
    let outBatterId = null;

    if (isWicket && wicketDetails) {
      wicketRecorded = true;
      innings.wickets += 1;
      outBatterId = wicketDetails.batterOutId || innings.currentStrikerId;
      const dismissedBatter = this.getOrCreateBatter(outBatterId);
      dismissedBatter.isOut = true;
      dismissedBatter.status = 'out';

      // Bowler credit: Run Outs, Retired Hurt, and Obstructing Field are NOT credited to the bowler
      const bowlerCreditedWickets = ['bowled', 'caught', 'lbw', 'stumped', 'hitWicket'];
      if (bowlerCreditedWickets.includes(wicketDetails.type)) {
        bowler.wickets += 1;
      }

      // Format dismissal string
      const fielder = wicketDetails.fielderId ? this.getPlayer(wicketDetails.fielderId) : null;
      const fielderName = fielder ? (fielder.displayName || fielder.name) : '';
      let text = '';
      switch (wicketDetails.type) {
        case 'bowled':
          text = `b ${bowler.name}`;
          break;
        case 'caught':
          text = fielderName ? `c ${fielderName} b ${bowler.name}` : `c & b ${bowler.name}`;
          break;
        case 'lbw':
          text = `lbw b ${bowler.name}`;
          break;
        case 'stumped':
          text = fielderName ? `st †${fielderName} b ${bowler.name}` : `st b ${bowler.name}`;
          break;
        case 'runOut':
          text = fielderName ? `run out (${fielderName})` : 'run out';
          break;
        case 'hitWicket':
          text = `hit wicket b ${bowler.name}`;
          break;
        case 'retiredHurt':
          text = 'retired hurt';
          dismissedBatter.status = 'retired';
          break;
        default:
          text = 'out';
      }
      dismissedBatter.dismissalText = text;

      // Fall of Wicket record
      innings.fallOfWickets.push({
        wicket: innings.wickets,
        score: innings.totalRuns,
        overs: this.formatOvers(innings.legalBallsBowled),
        batterName: dismissedBatter.name,
        batterRuns: dismissedBatter.runs
      });

      // End of innings check (All Out)
      const battingTeamPlayers = this.getBattingTeam().players;
      // In cricket, 10 wickets fall in an 11 player squad
      const maxWickets = Math.max(1, battingTeamPlayers.length - 1);
      if (innings.wickets >= maxWickets) {
        innings.isCompleted = true;
      } else {
        nextBatterPromptNeeded = true;
      }
    }

    // 7. Generate Delivery Badge & Commentary Text
    const badge = this.generateBadge(runsBat, extraType, extraRuns, isWicket, wicketDetails);
    const commentary = this.generateCommentary(runsBat, extraType, extraRuns, isWicket, wicketDetails, striker.name, bowler.name);

    // 8. Build Delivery Record
    const overNumber = Math.floor((innings.legalBallsBowled - (isLegalBall ? 1 : 0)) / 6);
    const ballInOver = isLegalBall ? ((innings.legalBallsBowled - 1) % 6) + 1 : (innings.currentOverDeliveries.length + 1);

    const deliveryRecord = {
      id: 'ball_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      overNumber,
      ballInOver,
      strikerId: striker.id,
      nonStrikerId: nonStriker.id,
      bowlerId: bowler.id,
      runsBat,
      extraType,
      extraRuns,
      totalRuns: deliveryRunsTotal,
      isLegalBall,
      isWicket,
      wicketDetails,
      isFreeHit: this.state.isFreeHit,
      badge,
      commentary,
      timestamp: Date.now()
    };

    innings.deliveries.push(deliveryRecord);
    innings.currentOverDeliveries.push(deliveryRecord);

    // Free Hit update:
    // If delivery was a front foot No Ball, next ball is Free Hit.
    // If current ball was Free Hit and was legal, Free Hit ends.
    if (isNoBall) {
      this.state.isFreeHit = true;
    } else if (isLegalBall && this.state.isFreeHit) {
      this.state.isFreeHit = false;
    }

    // 9. Strike Rotation Logic
    // Runs that rotate strike: odd runs off bat, odd byes, odd leg-byes, or odd runs on extras
    let runsForRotation = runsBat;
    if (isBye || isLegBye) runsForRotation = extraRuns;
    if (isWide || isNoBall) runsForRotation = extraRuns; // extra runs scampered by batters

    let shouldRotateStrike = (runsForRotation % 2 !== 0);

    // Run out rotation: if batsman out is striker or non-striker, or crossed
    if (isWicket && wicketDetails && wicketDetails.type === 'runOut') {
      if (wicketDetails.crossed) {
        shouldRotateStrike = !shouldRotateStrike;
      }
    }

    if (shouldRotateStrike) {
      const temp = innings.currentStrikerId;
      innings.currentStrikerId = innings.currentNonStrikerId;
      innings.currentNonStrikerId = temp;
    }

    // 10. Check Over Completion (6 legal deliveries)
    let overCompleted = false;
    if (isLegalBall && innings.legalBallsBowled % 6 === 0) {
      overCompleted = true;
      this.handleOverCompletion(bowler);
    }

    // 11. Check Target Chase / Match Completion
    this.checkMatchStatus();

    return {
      delivery: deliveryRecord,
      overCompleted,
      nextBatterPromptNeeded,
      outBatterId,
      isStrikerOut: wicketDetails ? wicketDetails.isStrikerOut : true,
      matchCompleted: this.state.isCompleted
    };
  }

  // Handle end of an over (6 legal balls)
  handleOverCompletion(currentBowler) {
    const innings = this.getCurrentInnings();
    
    // Check for Maiden over (0 runs conceded off bowler in this 6-ball over)
    const overDeliveries = innings.currentOverDeliveries;
    let overRunsConceded = 0;
    overDeliveries.forEach(d => {
      if (d.extraType === 'wide' || d.extraType === 'noBall') {
        overRunsConceded += d.totalRuns;
      } else if (d.extraType !== 'bye' && d.extraType !== 'legBye' && d.extraType !== 'penalty') {
        overRunsConceded += d.runsBat;
      }
    });

    if (overRunsConceded === 0) {
      currentBowler.maidens += 1;
    }

    // Save over summary
    innings.oversSummary.push({
      overNum: Math.floor(innings.legalBallsBowled / 6),
      bowlerId: currentBowler.id,
      bowlerName: currentBowler.name,
      runs: overDeliveries.reduce((sum, d) => sum + d.totalRuns, 0),
      wickets: overDeliveries.filter(d => d.isWicket).length,
      deliveries: [...innings.currentOverDeliveries]
    });

    // Reset current over deliveries list
    innings.currentOverDeliveries = [];

    // Cricket Law: End of over rotates strike
    const temp = innings.currentStrikerId;
    innings.currentStrikerId = innings.currentNonStrikerId;
    innings.currentNonStrikerId = temp;

    // Track previous bowler to prevent back-to-back overs
    innings.previousBowlerId = currentBowler.id;
    innings.currentBowlerId = null; // UI must prompt for next bowler

    // Check if max overs reached
    if (innings.legalBallsBowled >= this.state.maxOvers * 6) {
      innings.isCompleted = true;
    }
  }

  // Check whether innings or match has completed
  checkMatchStatus() {
    const innings = this.getCurrentInnings();
    const isFirstInnings = this.state.currentInningsIndex === 0;

    // 1st Innings completion check
    if (isFirstInnings) {
      if (innings.isCompleted || (this.state.format !== 'test' && innings.legalBallsBowled >= this.state.maxOvers * 6)) {
        innings.isCompleted = true;
      }
      return;
    }

    // 2nd Innings Target & Winner check
    const firstInnings = this.state.innings[0];
    const target = firstInnings.totalRuns + 1;
    innings.target = target;

    const chasingTeam = this.getBattingTeam();
    const defendingTeam = this.getBowlingTeam();

    // Condition A: Chasing team achieved target!
    if (innings.totalRuns >= target) {
      innings.isCompleted = true;
      this.state.isCompleted = true;
      const wicketsLeft = (chasingTeam.players.length - 1) - innings.wickets;
      const ballsRemaining = (this.state.maxOvers * 6) - innings.legalBallsBowled;
      this.state.resultText = `${chasingTeam.name} won by ${wicketsLeft} wicket${wicketsLeft === 1 ? '' : 's'}` + 
        (this.state.format !== 'test' ? ` (${ballsRemaining} balls remaining)` : '');
      return;
    }

    // Condition B: Chasing team is All Out or Overs Finished
    const maxWickets = chasingTeam.players.length - 1;
    const isAllOut = innings.wickets >= maxWickets;
    const isOversFinished = (this.state.format !== 'test' && innings.legalBallsBowled >= this.state.maxOvers * 6);

    if (isAllOut || isOversFinished) {
      innings.isCompleted = true;
      this.state.isCompleted = true;
      if (innings.totalRuns === firstInnings.totalRuns) {
        this.state.resultText = 'Match Tied! Fantastic finish!';
      } else if (innings.totalRuns < firstInnings.totalRuns) {
        const runsMargin = firstInnings.totalRuns - innings.totalRuns;
        this.state.resultText = `${defendingTeam.name} won by ${runsMargin} run${runsMargin === 1 ? '' : 's'}`;
      }
    }
  }

  // Check if 1st innings chosen overs have finished, all out, or declared
  isFirstInningsOversCompleted() {
    if (!this.state || !this.state.innings || !this.state.innings[0]) return false;
    const inn1 = this.state.innings[0];
    if (inn1.isCompleted) return true;
    if (this.state.currentInningsIndex > 0) return true;

    const battingTeam = inn1.battingTeamId === 'teamA' ? this.state.teamA : this.state.teamB;
    const isAllOut = inn1.wickets >= (battingTeam.players.length - 1);
    const isOversFinished = (this.state.format !== 'test' && inn1.legalBallsBowled >= this.state.maxOvers * 6);
    return isOversFinished || isAllOut;
  }

  // Check if BOTH 1st and 2nd innings have completed
  areBothInningsEnded() {
    if (!this.state || !this.state.innings || !this.state.innings[0] || !this.state.innings[1]) return false;
    if (this.state.isCompleted) return true;

    const inn1 = this.state.innings[0];
    const inn2 = this.state.innings[1];
    const inn1Ended = inn1.isCompleted || (this.state.format !== 'test' && inn1.legalBallsBowled >= this.state.maxOvers * 6);
    const inn2Ended = (this.state.currentInningsIndex === 1 && (inn2.isCompleted || this.state.isCompleted));
    return Boolean(inn1Ended && inn2Ended);
  }

  // Validation helper for Next Inning button
  canProceedToNextInnings() {
    if (!this.state) return { allowed: false, reason: 'No active match' };
    if (this.state.currentInningsIndex !== 0) {
      return { allowed: false, reason: 'Already in 2nd innings' };
    }
    const inn1 = this.state.innings[0];
    const isOversFinished = (this.state.format !== 'test' && inn1.legalBallsBowled >= this.state.maxOvers * 6);
    const battingTeam = this.getBattingTeam();
    const isAllOut = inn1.wickets >= (battingTeam.players.length - 1);
    const isDeclared = inn1.isCompleted;

    if (isOversFinished || isAllOut || isDeclared) {
      return { allowed: true, reason: 'Overs completed / Innings finished', isOversFinished, isAllOut };
    }
    const completedOvers = this.formatOvers(inn1.legalBallsBowled);
    return {
      allowed: false,
      reason: `Completed ${completedOvers} of ${this.state.maxOvers} overs`,
      oversBowled: completedOvers,
      maxOvers: this.state.maxOvers
    };
  }

  // Validation helper for Match End button
  canEndMatch() {
    if (!this.state) return { allowed: false, reason: 'No active match' };
    if (this.areBothInningsEnded()) {
      return { allowed: true, reason: 'Both 1st and 2nd innings have completed' };
    }
    if (this.state.currentInningsIndex === 0) {
      return {
        allowed: false,
        reason: 'Match End works only after both 1st and 2nd innings end. Currently in 1st innings.'
      };
    }
    return {
      allowed: false,
      reason: '2nd innings is still underway. Works once 2nd innings ends (target chased, overs finished, or all out).'
    };
  }

  // Conclude match manually (if requested or mutually ended)
  concludeMatchEarly(resultNote = null) {
    if (!this.state) return;
    this.saveSnapshot();
    if (this.state.innings[0]) this.state.innings[0].isCompleted = true;
    if (this.state.innings[1]) this.state.innings[1].isCompleted = true;
    this.state.isCompleted = true;
    if (resultNote) {
      this.state.resultText = resultNote;
    } else if (!this.state.resultText) {
      const inn1 = this.state.innings[0];
      const inn2 = this.state.innings[1];
      const team1 = inn1.battingTeamId === 'teamA' ? this.state.teamA : this.state.teamB;
      const team2 = inn2.battingTeamId === 'teamA' ? this.state.teamA : this.state.teamB;
      if (inn2.totalRuns > inn1.totalRuns) {
        this.state.resultText = `${team2.name} won by conclusion (${inn2.totalRuns} vs ${inn1.totalRuns})`;
      } else if (inn2.totalRuns < inn1.totalRuns) {
        this.state.resultText = `${team1.name} won by conclusion (${inn1.totalRuns} vs ${inn2.totalRuns})`;
      } else {
        this.state.resultText = 'Match Tied by conclusion';
      }
    }
  }

  // End/Declare 1st Innings Early & Calculate Target
  endFirstInnings() {
    if (!this.state || this.state.currentInningsIndex !== 0) return null;
    this.saveSnapshot();
    const inn1 = this.state.innings[0];
    inn1.isCompleted = true;
    const target = inn1.totalRuns + 1;
    this.state.innings[1].target = target;
    return target;
  }

  // Transition to 2nd Innings (Shift to Next Team)
  startSecondInnings(strikerId, nonStrikerId, openingBowlerId) {
    this.saveSnapshot();
    // Finalize 1st innings
    this.state.innings[0].isCompleted = true;

    this.state.currentInningsIndex = 1;
    const secondInnings = this.state.innings[1];
    secondInnings.target = this.state.innings[0].totalRuns + 1;

    this.setOpeners(strikerId, nonStrikerId, openingBowlerId);
    return secondInnings;
  }

  // Get list of eligible bowlers for the next over
  getAvailableBowlers() {
    const innings = this.getCurrentInnings();
    if (!innings) return [];
    const bowlingTeam = this.getBowlingTeam();
    const maxLimit = this.state.maxOversPerBowler;

    return bowlingTeam.players.filter(player => {
      // Rule 1: Cannot bowl 2 consecutive overs
      if (player.id === innings.previousBowlerId) return false;

      // Rule 2: Cannot exceed max overs limit
      const bowlerStat = innings.bowlers[player.id];
      if (bowlerStat && maxLimit && maxLimit < 900) {
        const oversBowled = Math.floor(bowlerStat.legalBalls / 6);
        if (oversBowled >= maxLimit) return false;
      }
      return true;
    });
  }

  // Get list of available batters who haven't batted yet
  getAvailableBatters() {
    const innings = this.getCurrentInnings();
    if (!innings) return [];
    const battingTeam = this.getBattingTeam();

    return battingTeam.players.filter(player => {
      const b = innings.batters[player.id];
      if (!b) return true; // not batted yet
      return b.status === 'yet_to_bat';
    });
  }

  // Add incoming player to batting team squad on the fly
  addPlayerToBattingTeam(name) {
    this.saveSnapshot();
    const innings = this.getCurrentInnings();
    if (!innings) return null;
    const battingTeam = this.getBattingTeam();
    const newSquadNumber = battingTeam.players.length + 1;
    const trimmed = (name || '').trim() || `Player ${newSquadNumber}`;
    const prefix = battingTeam.shortName || 'BAT';
    const newPlayer = {
      id: `p_${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: trimmed,
      squadNumber: newSquadNumber,
      displayName: trimmed,
      selectorLabel: `#${newSquadNumber}. ${trimmed}`,
      isDuplicateName: false
    };
    battingTeam.players.push(newPlayer);
    return newPlayer;
  }

  // Edit player name across state (incoming or active)
  editPlayerName(playerId, newName) {
    this.saveSnapshot();
    const trimmed = (newName || '').trim();
    if (!trimmed) return null;

    let targetPlayer = null;
    for (const teamKey of ['teamA', 'teamB']) {
      const team = this.state[teamKey];
      if (team && Array.isArray(team.players)) {
        const found = team.players.find(p => p.id === playerId);
        if (found) {
          found.name = trimmed;
          found.displayName = trimmed;
          found.selectorLabel = `#${found.squadNumber}. ${trimmed}`;
          targetPlayer = found;
          break;
        }
      }
    }

    if (!targetPlayer) return null;

    // Update any stats entries in active and past innings
    for (const inn of this.state.innings) {
      if (inn.batters && inn.batters[playerId]) {
        inn.batters[playerId].name = targetPlayer.displayName || targetPlayer.name;
        inn.batters[playerId].rawName = targetPlayer.name;
      }
      if (inn.bowlers && inn.bowlers[playerId]) {
        inn.bowlers[playerId].name = targetPlayer.displayName || targetPlayer.name;
        inn.bowlers[playerId].rawName = targetPlayer.name;
      }
      if (Array.isArray(inn.fallOfWickets)) {
        inn.fallOfWickets.forEach(fow => {
          if (fow.batterId === playerId) {
            fow.batterName = targetPlayer.name;
          }
        });
      }
      if (Array.isArray(inn.deliveries)) {
        inn.deliveries.forEach(del => {
          if (del.strikerId === playerId) del.strikerName = targetPlayer.name;
          if (del.bowlerId === playerId) del.bowlerName = targetPlayer.name;
        });
      }
    }

    return targetPlayer;
  }

  // Remove incoming player from batting squad (if they haven't batted yet)
  removePlayerFromBattingTeam(playerId) {
    const innings = this.getCurrentInnings();
    if (!innings) return { success: false, reason: 'No active innings.' };
    const battingTeam = this.getBattingTeam();

    // Prevent removing a batter currently at the crease
    if (innings.currentStrikerId === playerId || innings.currentNonStrikerId === playerId) {
      return { success: false, reason: 'Cannot remove a batsman currently at the crease.' };
    }

    // Prevent removing someone who already batted
    const batterStat = innings.batters[playerId];
    if (batterStat && (batterStat.isOut || batterStat.balls > 0 || batterStat.runs > 0)) {
      return { success: false, reason: 'Cannot remove a player who has already batted in this match.' };
    }

    // Clean up empty/unused record
    if (innings.batters && innings.batters[playerId]) {
      delete innings.batters[playerId];
    }

    this.saveSnapshot();
    battingTeam.players = battingTeam.players.filter(p => p.id !== playerId);
    return { success: true };
  }

  // Change or substitute an active batter with another player
  changeActiveBatter(oldBatterId, newBatterId) {
    this.saveSnapshot();
    const innings = this.getCurrentInnings();
    if (!innings) return false;

    const isStriker = innings.currentStrikerId === oldBatterId;
    const isNonStriker = innings.currentNonStrikerId === oldBatterId;
    if (!isStriker && !isNonStriker) return false;

    // Create stat record for new batter
    this.getOrCreateBatter(newBatterId);

    // If old batter never faced a ball and scored 0, release their batter record
    const oldStat = innings.batters[oldBatterId];
    if (oldStat && oldStat.balls === 0 && oldStat.runs === 0 && !oldStat.isOut) {
      delete innings.batters[oldBatterId];
    }

    if (isStriker) {
      innings.currentStrikerId = newBatterId;
    } else {
      innings.currentNonStrikerId = newBatterId;
    }

    // Refresh partnership
    if (innings.currentPartnership) {
      innings.currentPartnership.batter1Id = innings.currentStrikerId;
      innings.currentPartnership.batter2Id = innings.currentNonStrikerId;
    }

    return true;
  }

  // Helper formatting: legal balls to cricket overs e.g. 19 -> 3.1
  formatOvers(balls) {
    const completedOvers = Math.floor(balls / 6);
    const ballsInOver = balls % 6;
    return `${completedOvers}.${ballsInOver}`;
  }

  // Badge text generator for recent balls UI
  generateBadge(runsBat, extraType, extraRuns, isWicket, wicketDetails) {
    if (isWicket) {
      if (runsBat > 0) return `W+${runsBat}`;
      return 'W';
    }
    if (extraType === 'wide') {
      return extraRuns > 0 ? `${1 + extraRuns}wd` : 'wd';
    }
    if (extraType === 'noBall') {
      if (runsBat > 0) return `nb+${runsBat}`;
      return extraRuns > 0 ? `nb+${extraRuns}` : 'nb';
    }
    if (extraType === 'bye') {
      return `${extraRuns}b`;
    }
    if (extraType === 'legBye') {
      return `${extraRuns}lb`;
    }
    if (extraType === 'penalty') {
      return `+${extraRuns}p`;
    }
    return runsBat.toString();
  }

  // Commentary text generator
  generateCommentary(runsBat, extraType, extraRuns, isWicket, wicketDetails, strikerName, bowlerName) {
    if (isWicket) {
      return `OUT! ${strikerName} dismissed (${wicketDetails ? wicketDetails.type : 'wicket'})!`;
    }
    if (extraType === 'wide') {
      return `${bowlerName} sprays it wide outside the tramline. Wide called (+${1 + extraRuns} runs).`;
    }
    if (extraType === 'noBall') {
      return `NO BALL called against ${bowlerName}! Free hit on the next delivery!`;
    }
    if (extraType === 'bye') {
      return `${extraRuns} bye${extraRuns > 1 ? 's' : ''} taken by ${strikerName}.`;
    }
    if (extraType === 'legBye') {
      return `${extraRuns} leg bye${extraRuns > 1 ? 's' : ''} signaled by the umpire.`;
    }
    if (runsBat === 4) {
      return `FOUR! ${strikerName} finds the fence with pure timing!`;
    }
    if (runsBat === 6) {
      return `MAXIMUM! SIX! ${strikerName} launches it into the stands!`;
    }
    if (runsBat === 0) {
      return `Dot ball. Good tight line and length by ${bowlerName}.`;
    }
    return `${runsBat} run${runsBat > 1 ? 's' : ''} taken smoothly by ${strikerName}.`;
  }
}

window.CricketEngine = CricketEngine;
