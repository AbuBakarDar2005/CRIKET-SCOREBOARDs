// ===================================================================
// CRIC SCOREBOARD PRO - UI CONTROLLER & APP LOGIC
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  const engine = new CricketEngine();
  let currentFormat = 't20';
  let tossDecision = 'bat';
  let outIsStriker = true;
  let duplicateNameStyle = 'squadOrder';
  let matchResultModalShown = false;

  // Cache DOM Elements
  const setupView = document.getElementById('setupView');
  const liveScoringView = document.getElementById('liveScoringView');

  // Status & Header
  const offlineStatus = document.getElementById('offlineStatus');
  const offlineStatusText = document.getElementById('offlineStatusText');
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const btnHistory = document.getElementById('btnHistory');
  const btnExport = document.getElementById('btnExport');
  const btnNewMatch = document.getElementById('btnNewMatch');
  const logoClick = document.getElementById('logoClick');

  // Setup Form Elements
  const matchSetupForm = document.getElementById('matchSetupForm');
  const formatSelector = document.getElementById('formatSelector');
  const customOversGroup = document.getElementById('customOversGroup');
  const inputCustomOvers = document.getElementById('inputCustomOvers');
  const inputBowlerLimit = document.getElementById('inputBowlerLimit');
  const teamANameInput = document.getElementById('teamAName');
  const teamAShortInput = document.getElementById('teamAShort');
  const teamAPlayersInput = document.getElementById('teamAPlayers');
  const teamBNameInput = document.getElementById('teamBName');
  const teamBShortInput = document.getElementById('teamBShort');
  const teamBPlayersInput = document.getElementById('teamBPlayers');
  const tossWinnerSelect = document.getElementById('tossWinnerSelect');
  const tossDecisionSelector = document.getElementById('tossDecisionSelector');

  // Presets
  const presetIndAus = document.getElementById('presetIndAus');
  const presetEngSa = document.getElementById('presetEngSa');
  const presetClub10 = document.getElementById('presetClub10');
  const presetSameNames = document.getElementById('presetSameNames');
  const duplicateNameSelector = document.getElementById('duplicateNameSelector');

  // Scoreboard Elements
  const displayMatchFormat = document.getElementById('displayMatchFormat');
  const displayInningsBadge = document.getElementById('displayInningsBadge');
  const displayTossText = document.getElementById('displayTossText');
  const displayTeamFlag = document.getElementById('displayTeamFlag');
  const displayBattingTeam = document.getElementById('displayBattingTeam');
  const displayScoreRuns = document.getElementById('displayScoreRuns');
  const displayScoreWickets = document.getElementById('displayScoreWickets');
  const displayOvers = document.getElementById('displayOvers');
  const displayMaxOvers = document.getElementById('displayMaxOvers');
  const displayCRR = document.getElementById('displayCRR');
  const displayRRR = document.getElementById('displayRRR');
  const rrrContainer = document.getElementById('rrrContainer');
  const targetBanner = document.getElementById('targetBanner');
  const displayTargetRuns = document.getElementById('displayTargetRuns');
  const displayChaseMath = document.getElementById('displayChaseMath');
  const displayTargetProgress = document.getElementById('displayTargetProgress');
  const displayTargetFirstInningsText = document.getElementById('displayTargetFirstInningsText');
  const btnDeclare1stInnings = document.getElementById('btnDeclare1stInnings');
  const btnNextInning = document.getElementById('btnNextInning');
  const btnMatchEnd = document.getElementById('btnMatchEnd');
  const btnBannerNextInning = document.getElementById('btnBannerNextInning');
  const btnBannerMatchEnd = document.getElementById('btnBannerMatchEnd');
  const nextInningSubText = document.getElementById('nextInningSubText');
  const nextInningBadge = document.getElementById('nextInningBadge');
  const matchEndSubText = document.getElementById('matchEndSubText');
  const matchEndBadge = document.getElementById('matchEndBadge');
  const matchFlowAlert = document.getElementById('matchFlowAlert');
  const freeHitBanner = document.getElementById('freeHitBanner');

  // Recent Balls & Players
  const recentBallsTray = document.getElementById('recentBallsTray');
  const displayOverTotalRuns = document.getElementById('displayOverTotalRuns');
  const displayPartnership = document.getElementById('displayPartnership');
  const btnManualSwapStrike = document.getElementById('btnManualSwapStrike');
  const battersTableBody = document.getElementById('battersTableBody');
  const btnChangeBowlerMidOver = document.getElementById('btnChangeBowlerMidOver');
  const displayBowlerName = document.getElementById('displayBowlerName');
  const displayBowlerLimit = document.getElementById('displayBowlerLimit');
  const bowlerStatO = document.getElementById('bowlerStatO');
  const bowlerStatM = document.getElementById('bowlerStatM');
  const bowlerStatR = document.getElementById('bowlerStatR');
  const bowlerStatW = document.getElementById('bowlerStatW');
  const bowlerStatEcon = document.getElementById('bowlerStatEcon');

  // Scoring Buttons
  const scoreButtons = document.querySelectorAll('.score-btn');
  const extraButtons = document.querySelectorAll('.extra-btn');
  const btnWicketModal = document.getElementById('btnWicketModal');
  const btnCustomCombo = document.getElementById('btnCustomCombo');
  const btnUndoBall = document.getElementById('btnUndoBall');

  // Modals
  const openersModal = document.getElementById('openersModal');
  const openersForm = document.getElementById('openersForm');
  const selectStriker = document.getElementById('selectStriker');
  const selectNonStriker = document.getElementById('selectNonStriker');
  const selectOpeningBowler = document.getElementById('selectOpeningBowler');

  // Innings Break Modal Elements
  const inningsBreakModal = document.getElementById('inningsBreakModal');
  const breakFirstTeamScore = document.getElementById('breakFirstTeamScore');
  const breakFirstTeamOvers = document.getElementById('breakFirstTeamOvers');
  const breakTargetRuns = document.getElementById('breakTargetRuns');
  const breakChaseDetails = document.getElementById('breakChaseDetails');
  const breakRRRText = document.getElementById('breakRRRText');
  const btnBreakTargetVal = document.getElementById('btnBreakTargetVal');
  const inningsBreakForm = document.getElementById('inningsBreakForm');
  const breakStrikerSelect = document.getElementById('breakStrikerSelect');
  const breakNonStrikerSelect = document.getElementById('breakNonStrikerSelect');
  const breakOpeningBowlerSelect = document.getElementById('breakOpeningBowlerSelect');

  const bowlerModal = document.getElementById('bowlerModal');
  const bowlerForm = document.getElementById('bowlerForm');
  const selectNewBowler = document.getElementById('selectNewBowler');

  const wicketModal = document.getElementById('wicketModal');
  const wicketForm = document.getElementById('wicketForm');
  const btnCloseWicketModal = document.getElementById('btnCloseWicketModal');
  const wicketTypeSelect = document.getElementById('wicketTypeSelect');
  const optStrikerOut = document.getElementById('optStrikerOut');
  const optNonStrikerOut = document.getElementById('optNonStrikerOut');
  const fielderGroup = document.getElementById('fielderGroup');
  const selectFielder = document.getElementById('selectFielder');
  const runOutOptionsGroup = document.getElementById('runOutOptionsGroup');
  const runOutCompletedRuns = document.getElementById('runOutCompletedRuns');
  const runOutCrossedCheck = document.getElementById('runOutCrossedCheck');
  const selectNextBatter = document.getElementById('selectNextBatter');
  const nextBatterGroup = document.getElementById('nextBatterGroup');
  const btnEditNextBatterWicket = document.getElementById('btnEditNextBatterWicket');
  const btnAddNextBatterWicket = document.getElementById('btnAddNextBatterWicket');
  const btnRemoveNextBatterWicket = document.getElementById('btnRemoveNextBatterWicket');

  // Next Batter Dedicated Modal
  const nextBatterModal = document.getElementById('nextBatterModal');
  const btnCloseNextBatterModal = document.getElementById('btnCloseNextBatterModal');
  const nextBatterForm = document.getElementById('nextBatterForm');
  const selectStandaloneNextBatter = document.getElementById('selectStandaloneNextBatter');
  const nextBatterEndSelector = document.getElementById('nextBatterEndSelector');
  const btnEditNextBatterModal = document.getElementById('btnEditNextBatterModal');
  const btnAddNextBatterModal = document.getElementById('btnAddNextBatterModal');
  const btnRemoveNextBatterModal = document.getElementById('btnRemoveNextBatterModal');
  let nextBatterPendingSlot = true; // true = striker, false = nonStriker

  // Manage On-field Batters Modal
  const btnManageBatters = document.getElementById('btnManageBatters');
  const manageBattersModal = document.getElementById('manageBattersModal');
  const btnCloseManageBattersModal = document.getElementById('btnCloseManageBattersModal');
  const optManageStriker = document.getElementById('optManageStriker');
  const optManageNonStriker = document.getElementById('optManageNonStriker');
  const displayManageBatterName = document.getElementById('displayManageBatterName');
  const displayManageBatterStats = document.getElementById('displayManageBatterStats');
  const btnTriggerEditActiveBatter = document.getElementById('btnTriggerEditActiveBatter');
  const btnTriggerReplaceActiveBatter = document.getElementById('btnTriggerReplaceActiveBatter');
  const replaceBatterSection = document.getElementById('replaceBatterSection');
  const selectReplacementBatter = document.getElementById('selectReplacementBatter');
  const btnAddReplacementPlayer = document.getElementById('btnAddReplacementPlayer');
  const btnConfirmReplaceBatter = document.getElementById('btnConfirmReplaceBatter');
  let manageBatterSelectedSlot = 'striker'; // 'striker' or 'nonStriker'

  // Player Prompt Modal
  const playerPromptModal = document.getElementById('playerPromptModal');
  const btnClosePlayerPromptModal = document.getElementById('btnClosePlayerPromptModal');
  const playerPromptTitle = document.getElementById('playerPromptTitle');
  const playerPromptLabel = document.getElementById('playerPromptLabel');
  const playerPromptInput = document.getElementById('playerPromptInput');
  const playerPromptHint = document.getElementById('playerPromptHint');
  const playerPromptForm = document.getElementById('playerPromptForm');
  const btnCancelPlayerPrompt = document.getElementById('btnCancelPlayerPrompt');

  const comboModal = document.getElementById('comboModal');
  const comboForm = document.getElementById('comboForm');
  const btnCloseComboModal = document.getElementById('btnCloseComboModal');
  const comboExtraType = document.getElementById('comboExtraType');
  const comboRunsBat = document.getElementById('comboRunsBat');
  const comboExtraRuns = document.getElementById('comboExtraRuns');

  const matchResultModal = document.getElementById('matchResultModal');
  const resultHeadline = document.getElementById('resultHeadline');
  const resultSubtext = document.getElementById('resultSubtext');
  const resultScoreSummary = document.getElementById('resultScoreSummary');
  const matchEndScorecardsContainer = document.getElementById('matchEndScorecardsContainer');
  const btnCloseResultModal = document.getElementById('btnCloseResultModal');
  const btnResultViewScorecard = document.getElementById('btnResultViewScorecard');
  const btnResultExport = document.getElementById('btnResultExport');
  const btnResultNewMatch = document.getElementById('btnResultNewMatch');

  const historyModal = document.getElementById('historyModal');
  const btnCloseHistoryModal = document.getElementById('btnCloseHistoryModal');
  const historyListContainer = document.getElementById('historyListContainer');

  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const fullScorecardContainer = document.getElementById('fullScorecardContainer');
  const commentaryList = document.getElementById('commentaryList');
  const fowList = document.getElementById('fowList');
  const extrasBreakdown = document.getElementById('extrasBreakdown');

  // ===================================================================
  // 1. SERVICE WORKER & OFFLINE DETECTION
  // ===================================================================
  function initOfflineServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('CricScore ServiceWorker registered successfully:', reg.scope);
      }).catch((err) => {
        console.warn('ServiceWorker registration error (may occur on non-https/file protocol):', err);
      });
    }

    function updateNetworkStatus() {
      if (navigator.onLine) {
        offlineStatus.classList.remove('offline');
        offlineStatusText.textContent = 'Live / Offline Ready';
      } else {
        offlineStatus.classList.add('offline');
        offlineStatusText.textContent = 'Offline Mode';
      }
    }
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
  }

  // ===================================================================
  // 2. PRESETS & SQUADS
  // ===================================================================
  const PRESET_SQUADS = {
    ind: [
      'Rohit Sharma (C)', 'Virat Kohli', 'Suryakumar Yadav', 'Rishabh Pant (wk)',
      'Hardik Pandya', 'Shivam Dube', 'Ravindra Jadeja', 'Axar Patel',
      'Kuldeep Yadav', 'Arshdeep Singh', 'Jasprit Bumrah'
    ],
    aus: [
      'Travis Head', 'David Warner', 'Mitchell Marsh (C)', 'Glenn Maxwell',
      'Marcus Stoinis', 'Tim David', 'Matthew Wade (wk)', 'Pat Cummins',
      'Mitchell Starc', 'Adam Zampa', 'Josh Hazlewood'
    ],
    eng: [
      'Phil Salt', 'Jos Buttler (C, wk)', 'Will Jacks', 'Harry Brook',
      'Liam Livingstone', 'Moeen Ali', 'Sam Curran', 'Chris Jordan',
      'Jofra Archer', 'Adil Rashid', 'Reece Topley'
    ],
    sa: [
      'Quinton de Kock (wk)', 'Reeza Hendricks', 'Aiden Markram (C)', 'Heinrich Klaasen',
      'David Miller', 'Tristan Stubbs', 'Marco Jansen', 'Keshav Maharaj',
      'Kagiso Rabada', 'Anrich Nortje', 'Tabraiz Shamsi'
    ],
    clubA: [
      'Alex Mercer (C)', 'Liam Vance', 'Samson Cole', 'Noah Reed (wk)',
      'Mason Brooks', 'Lucas Shaw', 'Ethan Blake', 'Oliver Hayes',
      'Jack Bennett', 'Harry Scott', 'David Ross'
    ],
    clubB: [
      'Leo Sterling (C)', 'Oscar Price', 'George Bailey', 'Arthur King (wk)',
      'Charlie Ward', 'Daniel Fox', 'Henry Adams', 'Thomas Clark',
      'Benjamin Foster', 'Edward Miller', 'Archie Wright'
    ],
    sameNamesA: [
      'Rahul', 'Rahul', 'Amit', 'Amit', 'Ali', 'Ali',
      'Vikram', 'Rohan', 'Karan', 'Karan', 'Sam'
    ],
    sameNamesB: [
      'John', 'John', 'David', 'David', 'Chris', 'Chris',
      'Mark', 'Paul', 'Luke', 'James', 'James'
    ]
  };

  function setPreset(format, customOvers, teamA, teamB) {
    currentFormat = format;
    formatSelector.querySelectorAll('.pill-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.format === format);
    });

    if (format === 'custom') {
      customOversGroup.style.display = 'grid';
      inputCustomOvers.value = customOvers;
      inputBowlerLimit.value = Math.max(1, Math.ceil(customOvers / 5));
    } else {
      customOversGroup.style.display = 'none';
    }

    teamANameInput.value = teamA.name;
    teamAShortInput.value = teamA.short;
    teamAPlayersInput.value = teamA.squad.join('\n');

    teamBNameInput.value = teamB.name;
    teamBShortInput.value = teamB.short;
    teamBPlayersInput.value = teamB.squad.join('\n');

    tossWinnerSelect.innerHTML = `
      <option value="teamA">${teamA.name}</option>
      <option value="teamB">${teamB.name}</option>
    `;

    if (window.soundEffects) window.soundEffects.playTap();
  }

  // Setup initial default squad textareas
  teamAPlayersInput.value = PRESET_SQUADS.ind.join('\n');
  teamBPlayersInput.value = PRESET_SQUADS.aus.join('\n');

  presetIndAus.addEventListener('click', () => {
    setPreset('t20', 20, { name: 'India', short: 'IND', squad: PRESET_SQUADS.ind }, { name: 'Australia', short: 'AUS', squad: PRESET_SQUADS.aus });
  });

  presetEngSa.addEventListener('click', () => {
    setPreset('odi', 50, { name: 'England', short: 'ENG', squad: PRESET_SQUADS.eng }, { name: 'South Africa', short: 'SA', squad: PRESET_SQUADS.sa });
  });

  presetClub10.addEventListener('click', () => {
    setPreset('custom', 10, { name: 'Lions XI', short: 'LIO', squad: PRESET_SQUADS.clubA }, { name: 'Tigers XI', short: 'TIG', squad: PRESET_SQUADS.clubB });
  });

  if (presetSameNames) {
    presetSameNames.addEventListener('click', () => {
      setPreset('t20', 20, { name: 'Red XI', short: 'RED', squad: PRESET_SQUADS.sameNamesA }, { name: 'Blue XI', short: 'BLU', squad: PRESET_SQUADS.sameNamesB });
    });
  }

  // Duplicate name style selection change
  if (duplicateNameSelector) {
    duplicateNameSelector.querySelectorAll('.pill-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        duplicateNameSelector.querySelectorAll('.pill-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        duplicateNameStyle = opt.dataset.style;
        if (window.soundEffects) window.soundEffects.playTap();
      });
    });
  }

  // Format selection change
  formatSelector.querySelectorAll('.pill-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      formatSelector.querySelectorAll('.pill-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      currentFormat = opt.dataset.format;
      customOversGroup.style.display = currentFormat === 'custom' ? 'grid' : 'none';
      if (window.soundEffects) window.soundEffects.playTap();
    });
  });

  // Toss decision change
  tossDecisionSelector.querySelectorAll('.pill-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      tossDecisionSelector.querySelectorAll('.pill-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      tossDecision = opt.dataset.decision;
      if (window.soundEffects) window.soundEffects.playTap();
    });
  });

  // Team names auto-update toss dropdown options
  teamANameInput.addEventListener('input', () => {
    tossWinnerSelect.options[0].text = teamANameInput.value || 'Team A';
  });
  teamBNameInput.addEventListener('input', () => {
    tossWinnerSelect.options[1].text = teamBNameInput.value || 'Team B';
  });

  // ===================================================================
  // 3. MATCH INITIALIZATION & SETUP
  // ===================================================================
  matchSetupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const parseSquad = (rawText, defaultPrefix) => {
      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 0) return lines;
      const defaults = [];
      for (let i = 1; i <= 11; i++) defaults.push(`${defaultPrefix} Player ${i}`);
      return defaults;
    };

    const teamASquad = parseSquad(teamAPlayersInput.value, teamAShortInput.value || 'TMA');
    const teamBSquad = parseSquad(teamBPlayersInput.value, teamBShortInput.value || 'TMB');

    const config = {
      format: currentFormat,
      customOvers: inputCustomOvers.value,
      maxOversPerBowler: currentFormat === 'custom' ? inputBowlerLimit.value : null,
      duplicateNameStyle: duplicateNameStyle,
      teamA: {
        id: 'teamA',
        name: teamANameInput.value.trim() || 'Team A',
        shortName: (teamAShortInput.value.trim() || 'TMA').toUpperCase(),
        color: '#2563eb',
        players: teamASquad
      },
      teamB: {
        id: 'teamB',
        name: teamBNameInput.value.trim() || 'Team B',
        shortName: (teamBShortInput.value.trim() || 'TMB').toUpperCase(),
        color: '#eab308',
        players: teamBSquad
      },
      tossWinner: tossWinnerSelect.value,
      tossDecision: tossDecision
    };

    engine.initMatch(config);
    StorageManager.saveMatch(engine.state);

    if (window.soundEffects) window.soundEffects.playTap();
    showOpenersModal();
  });

  // Openers Modal
  function showOpenersModal() {
    const battingTeam = engine.getBattingTeam();
    const bowlingTeam = engine.getBowlingTeam();

    selectStriker.innerHTML = battingTeam.players.map(p => `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`).join('');
    selectNonStriker.innerHTML = battingTeam.players.map((p, idx) => `<option value="${p.id}" ${idx === 1 ? 'selected' : ''}>${p.selectorLabel || p.displayName || p.name}</option>`).join('');
    selectOpeningBowler.innerHTML = bowlingTeam.players.map(p => `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`).join('');

    openersModal.classList.add('show');
  }

  openersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const strikerId = selectStriker.value;
    const nonStrikerId = selectNonStriker.value;
    const bowlerId = selectOpeningBowler.value;

    if (strikerId === nonStrikerId) {
      alert('Striker and Non-Striker must be two different players!');
      return;
    }

    if (engine.state.currentInningsIndex === 0) {
      engine.setOpeners(strikerId, nonStrikerId, bowlerId);
    } else {
      engine.startSecondInnings(strikerId, nonStrikerId, bowlerId);
    }

    StorageManager.saveMatch(engine.state);
    openersModal.classList.remove('show');

    setupView.style.display = 'none';
    liveScoringView.style.display = 'block';

    if (window.soundEffects) window.soundEffects.playTap();
    renderScoreboard();
  });

  // ===================================================================
  // 4. RENDERING & UI SYNC ENGINE
  // ===================================================================
  function renderScoreboard() {
    if (!engine.state) return;
    const innings = engine.getCurrentInnings();
    if (!innings) return;

    const battingTeam = engine.getBattingTeam();
    const bowlingTeam = engine.getBowlingTeam();
    const isFirstInnings = engine.state.currentInningsIndex === 0;

    // Header & Format
    displayMatchFormat.textContent = engine.state.format.toUpperCase();
    displayInningsBadge.textContent = isFirstInnings ? '1st Innings' : '2nd Innings';

    const tossTeamName = engine.state.toss.winner === 'teamA' ? engine.state.teamA.name : engine.state.teamB.name;
    displayTossText.textContent = `${tossTeamName} won toss & elected to ${engine.state.toss.decision}`;

    // Team Flag & Name
    displayBattingTeam.textContent = battingTeam.name;
    displayTeamFlag.style.backgroundColor = battingTeam.color || 'var(--accent-pitch)';

    // Score & Overs
    displayScoreRuns.textContent = innings.totalRuns;
    displayScoreWickets.textContent = innings.wickets;
    displayOvers.textContent = engine.formatOvers(innings.legalBallsBowled);
    displayMaxOvers.textContent = engine.state.format === 'test' ? 'ov' : `/ ${engine.state.maxOvers} ov`;

    // CRR Math
    const totalLegalOvers = innings.legalBallsBowled / 6;
    const crr = totalLegalOvers > 0 ? (innings.totalRuns / totalLegalOvers).toFixed(2) : '0.00';
    displayCRR.textContent = crr;

    // Target / 2nd Innings calculations
    if (!isFirstInnings && innings.target) {
      targetBanner.style.display = 'block';
      rrrContainer.style.display = 'block';
      if (displayFirstInningsSummary) displayFirstInningsSummary.style.display = 'inline-block';
      if (btnDeclare1stInnings) btnDeclare1stInnings.style.display = 'none';

      const inn1 = engine.state.innings[0];
      const team1 = inn1.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
      if (displayFirstInningsSummary) {
        displayFirstInningsSummary.textContent = `1st Innings: ${team1.shortName || team1.name} ${inn1.totalRuns}/${inn1.wickets} (${engine.formatOvers(inn1.legalBallsBowled)} ov)`;
      }

      displayTargetRuns.textContent = innings.target;
      if (displayTargetFirstInningsText) {
        displayTargetFirstInningsText.textContent = `(${team1.name} scored ${inn1.totalRuns}/${inn1.wickets})`;
      }

      const runsNeeded = Math.max(0, innings.target - innings.totalRuns);
      const ballsRemaining = Math.max(0, (engine.state.maxOvers * 6) - innings.legalBallsBowled);
      displayChaseMath.textContent = `Need ${runsNeeded} run${runsNeeded === 1 ? '' : 's'} from ${ballsRemaining} ball${ballsRemaining === 1 ? '' : 's'}`;

      const rrr = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';
      displayRRR.textContent = rrr;

      const percent = Math.min(100, (innings.totalRuns / innings.target) * 100);
      displayTargetProgress.style.width = `${percent}%`;
    } else {
      targetBanner.style.display = 'none';
      rrrContainer.style.display = 'none';
      if (displayFirstInningsSummary) displayFirstInningsSummary.style.display = 'none';
      if (btnDeclare1stInnings) btnDeclare1stInnings.style.display = 'inline-flex';
    }

    // Free Hit Alert
    freeHitBanner.style.display = engine.state.isFreeHit ? 'flex' : 'none';

    // Undo button state
    btnUndoBall.disabled = !engine.canUndo();

    // Render Recent Deliveries of current over
    renderRecentBalls(innings);

    // Render Batters Table
    renderBatters(innings);

    // Render Bowler Card
    renderBowler(innings);

    // Render Tabs
    renderFullScorecard();
    renderCommentary(innings);
    renderFallOfWicketsAndExtras(innings);

    // Render Match Progression Controls (NEXT INNING & MATCH END)
    renderMatchFlowControls();

    // Check Match Completion Modal (show automatically on initial completion)
    if (engine.state.isCompleted && !matchResultModalShown) {
      matchResultModalShown = true;
      showMatchResultModal();
    }
  }

  // Render Match Progression Controls (NEXT INNING & MATCH END)
  function renderMatchFlowControls() {
    if (!engine.state) return;
    const isFirstInnings = engine.state.currentInningsIndex === 0;
    const inn1 = engine.state.innings[0];
    const inn2 = engine.state.innings[1];
    const canNext = engine.canProceedToNextInnings();
    const bothEnded = engine.areBothInningsEnded();

    // 1. NEXT INNING BUTTON STATE
    if (btnNextInning) {
      if (isFirstInnings) {
        const completedOvers = engine.formatOvers(inn1.legalBallsBowled);
        const maxOvers = engine.state.maxOvers;
        const battingTeam = engine.getBattingTeam();
        const isAllOut = inn1.wickets >= (battingTeam.players.length - 1);

        if (canNext.allowed) {
          // Unlocked & Ready after completing chosen overs or all out
          btnNextInning.className = 'match-flow-btn btn-flow-next is-ready';
          btnNextInning.disabled = false;
          if (isAllOut) {
            nextInningSubText.textContent = `All Out (${inn1.wickets} wkts)! Ready to shift to 2nd innings`;
            nextInningBadge.textContent = '⚡ ALL OUT';
          } else {
            nextInningSubText.textContent = `All ${maxOvers} Overs Completed! Click to Start 2nd Innings`;
            nextInningBadge.textContent = '✨ READY';
          }
          if (btnBannerNextInning) {
            btnBannerNextInning.style.display = 'inline-flex';
            btnBannerNextInning.className = 'flow-pill-btn btn-pill-next is-ready';
            btnBannerNextInning.textContent = '⏩ Next Inning (Ready!)';
          }
        } else {
          // Incomplete overs
          btnNextInning.className = 'match-flow-btn btn-flow-next is-locked';
          btnNextInning.disabled = false;
          nextInningSubText.textContent = `Works after completing chosen ${maxOvers} ov (${completedOvers}/${maxOvers} bowled)`;
          nextInningBadge.textContent = `${completedOvers}/${maxOvers} Ov`;
          if (btnBannerNextInning) {
            btnBannerNextInning.style.display = 'inline-flex';
            btnBannerNextInning.className = 'flow-pill-btn btn-pill-next';
            btnBannerNextInning.textContent = `⏩ Next Inning (${completedOvers}/${maxOvers})`;
          }
        }
      } else {
        // 2nd Innings in progress or match complete
        btnNextInning.className = 'match-flow-btn btn-flow-next is-done';
        btnNextInning.disabled = true;
        const team1 = inn1.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
        nextInningSubText.textContent = `1st Innings Ended: ${team1.name} scored ${inn1.totalRuns}/${inn1.wickets}`;
        nextInningBadge.textContent = '✅ Completed';
        if (btnBannerNextInning) {
          btnBannerNextInning.style.display = 'none';
        }
      }
    }

    // 2. MATCH END BUTTON STATE
    if (btnMatchEnd) {
      if (bothEnded) {
        // Ready! Both 1st and 2nd innings have ended!
        btnMatchEnd.className = 'match-flow-btn btn-flow-end is-ready';
        btnMatchEnd.disabled = false;
        matchEndSubText.textContent = engine.state.resultText || 'Both Innings Completed! Click to View Match Results';
        matchEndBadge.textContent = '🏆 MATCH FINISHED';

        if (btnBannerMatchEnd) {
          btnBannerMatchEnd.style.display = 'inline-flex';
          btnBannerMatchEnd.className = 'flow-pill-btn btn-pill-end is-ready';
          btnBannerMatchEnd.textContent = '🏆 Match End (View Results)';
        }
      } else {
        // Locked: Waiting for both innings to end
        btnMatchEnd.className = 'match-flow-btn btn-flow-end is-locked';
        btnMatchEnd.disabled = false;

        if (isFirstInnings) {
          matchEndSubText.textContent = 'Works after both 1st & 2nd innings end (currently 1st innings)';
          matchEndBadge.textContent = '🔒 Locked';
          if (btnBannerMatchEnd) {
            btnBannerMatchEnd.style.display = 'none';
          }
        } else {
          const runsNeeded = Math.max(0, (inn2.target || 0) - inn2.totalRuns);
          const ballsRemaining = Math.max(0, (engine.state.maxOvers * 6) - inn2.legalBallsBowled);
          matchEndSubText.textContent = `Works after 2nd innings ends (${runsNeeded} runs needed from ${ballsRemaining}b)`;
          matchEndBadge.textContent = '🔒 Chasing';
          if (btnBannerMatchEnd) {
            btnBannerMatchEnd.style.display = 'inline-flex';
            btnBannerMatchEnd.className = 'flow-pill-btn btn-pill-end';
            btnBannerMatchEnd.textContent = '🏆 Match End (Locked)';
          }
        }
      }
    }

    // 3. FLOW ALERT BANNER
    if (matchFlowAlert) {
      if (isFirstInnings && canNext.allowed) {
        matchFlowAlert.style.display = 'flex';
        matchFlowAlert.className = 'flow-alert-banner';
        const team1 = inn1.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
        matchFlowAlert.innerHTML = `
          <span>🎉 <strong>1st Innings Completed (${team1.name} ${inn1.totalRuns}/${inn1.wickets})!</strong> Target set to <strong>${inn1.totalRuns + 1} runs</strong>. Click <strong>NEXT INNING</strong> to start 2nd Innings.</span>
          <button type="button" class="swap-strike-btn" style="background:#ffffff; color:#065f46; font-weight:800; border:none; padding: 4px 10px;" id="btnAlertNextInning">Next Inning ⏩</button>
        `;
        const alertBtn = document.getElementById('btnAlertNextInning');
        if (alertBtn) {
          alertBtn.onclick = () => handleNextInningClick();
        }
      } else if (bothEnded) {
        matchFlowAlert.style.display = 'flex';
        matchFlowAlert.className = 'flow-alert-banner alert-warning';
        matchFlowAlert.innerHTML = `
          <span>🏆 <strong>MATCH CONCLUDED!</strong> ${engine.state.resultText || 'Match has ended.'} Click <strong>MATCH END</strong> to view full presentation.</span>
          <button type="button" class="swap-strike-btn" style="background:#ffffff; color:#78350f; font-weight:800; border:none; padding: 4px 10px;" id="btnAlertMatchEnd">Match End 🏆</button>
        `;
        const alertEndBtn = document.getElementById('btnAlertMatchEnd');
        if (alertEndBtn) {
          alertEndBtn.onclick = () => handleMatchEndClick();
        }
      } else {
        matchFlowAlert.style.display = 'none';
      }
    }
  }

  // Render Current Over Balls
  function renderRecentBalls(innings) {
    const balls = innings.currentOverDeliveries;
    if (balls.length === 0) {
      recentBallsTray.innerHTML = '<span style="font-size: 0.8rem; color: var(--text-dim);">Over starting...</span>';
      displayOverTotalRuns.textContent = '0';
      return;
    }

    let overRuns = 0;
    recentBallsTray.innerHTML = balls.map(b => {
      overRuns += b.totalRuns;
      let badgeClass = 'ball-run';
      if (b.isWicket) badgeClass = 'ball-wicket';
      else if (b.runsBat === 4) badgeClass = 'ball-four';
      else if (b.runsBat === 6) badgeClass = 'ball-six';
      else if (b.extraType) badgeClass = 'ball-extra';
      else if (b.runsBat === 0) badgeClass = 'ball-dot';

      return `<div class="ball-badge ${badgeClass}" title="${b.commentary}">${b.badge}</div>`;
    }).join('');

    displayOverTotalRuns.textContent = overRuns;
  }

  // Render Batsmen Table
  function renderBatters(innings) {
    const striker = innings.currentStrikerId ? engine.getOrCreateBatter(innings.currentStrikerId) : null;
    const nonStriker = innings.currentNonStrikerId ? engine.getOrCreateBatter(innings.currentNonStrikerId) : null;

    let html = '';
    if (striker) {
      html += `
        <tr class="batter-row is-striker">
          <td class="batter-name-cell">
            <span class="striker-star">*</span>
            <strong>${striker.name}</strong>
            <button type="button" class="table-action-icon-btn btn-table-edit-batter" data-id="${striker.id}" title="Edit Batter Name">✏️</button>
            <button type="button" class="table-action-icon-btn btn-table-change-batter" data-slot="striker" title="Change / Replace Batter">⇄</button>
          </td>
          <td class="num"><strong>${striker.runs}</strong></td>
          <td class="num">${striker.balls}</td>
          <td class="num">${striker.fours}</td>
          <td class="num">${striker.sixes}</td>
          <td class="num">${striker.strikeRate}</td>
        </tr>
      `;
    }
    if (nonStriker) {
      html += `
        <tr class="batter-row">
          <td class="batter-name-cell">
            <span style="visibility: hidden;" class="striker-star">*</span>
            <span>${nonStriker.name}</span>
            <button type="button" class="table-action-icon-btn btn-table-edit-batter" data-id="${nonStriker.id}" title="Edit Batter Name">✏️</button>
            <button type="button" class="table-action-icon-btn btn-table-change-batter" data-slot="nonStriker" title="Change / Replace Batter">⇄</button>
          </td>
          <td class="num"><strong>${nonStriker.runs}</strong></td>
          <td class="num">${nonStriker.balls}</td>
          <td class="num">${nonStriker.fours}</td>
          <td class="num">${nonStriker.sixes}</td>
          <td class="num">${nonStriker.strikeRate}</td>
        </tr>
      `;
    }
    battersTableBody.innerHTML = html;

    // Partnership
    const p = innings.currentPartnership;
    displayPartnership.textContent = `P'ship: ${p.runs} (${p.balls}b)`;
  }

  // Render Active Bowler Card
  function renderBowler(innings) {
    if (!innings.currentBowlerId) {
      displayBowlerName.textContent = 'Awaiting Next Bowler';
      bowlerStatO.textContent = '0.0';
      bowlerStatM.textContent = '0';
      bowlerStatR.textContent = '0';
      bowlerStatW.textContent = '0';
      bowlerStatEcon.textContent = '0.00';
      return;
    }

    const bowler = engine.getOrCreateBowler(innings.currentBowlerId);
    displayBowlerName.textContent = bowler.name;
    displayBowlerLimit.textContent = engine.state.format === 'test' ? 'No Limit' : `Max ${engine.state.maxOversPerBowler} ov`;
    bowlerStatO.textContent = bowler.oversFormatted;
    bowlerStatM.textContent = bowler.maidens;
    bowlerStatR.textContent = bowler.runsConceded;
    bowlerStatW.textContent = bowler.wickets;
    bowlerStatEcon.textContent = bowler.economy;
  }

  // Generate Complete Team Innings Scorecard Card (White Background, Blue Borders)
  function generateTeamScorecardHTML(inn, idx) {
    if (!inn) return '';
    const isFirstInnings = idx === 0;
    const batTeam = inn.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
    const bowlTeam = inn.bowlingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
    const oversText = engine.formatOvers(inn.legalBallsBowled);
    const totalLegalOvers = inn.legalBallsBowled / 6;
    const crr = totalLegalOvers > 0 ? (inn.totalRuns / totalLegalOvers).toFixed(2) : '0.00';

    const battersList = Object.values(inn.batters);
    const bowlersList = Object.values(inn.bowlers);

    return `
      <div class="side-scorecard-card">
        <!-- Header Bar: Blue gradient with crisp White text -->
        <div class="side-scorecard-header">
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.9;">
              ${isFirstInnings ? '1st Innings' : '2nd Innings'}
            </div>
            <div style="font-size: 1.15rem; font-weight: 800;">
              ${batTeam.name}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.35rem; font-weight: 900; font-family: var(--font-mono);">
              ${inn.totalRuns}/${inn.wickets}
            </div>
            <div style="font-size: 0.78rem; opacity: 0.9;">
              (${oversText} / ${engine.state.maxOvers} ov • CRR ${crr})
            </div>
          </div>
        </div>

        <div class="side-scorecard-body">
          <!-- Batting Table -->
          <div class="table-section-title">🏏 Batting</div>
          <table class="data-table" style="margin-bottom: 12px;">
            <thead>
              <tr>
                <th>Batter</th>
                <th>Dismissal</th>
                <th class="num">R</th>
                <th class="num">B</th>
                <th class="num">4s</th>
                <th class="num">6s</th>
                <th class="num">SR</th>
              </tr>
            </thead>
            <tbody>
              ${battersList.length > 0 ? battersList.map(b => `
                <tr ${b.status === 'batting' ? 'class="batter-row is-striker"' : ''}>
                  <td><strong>${b.name}</strong> ${b.status === 'batting' ? '<span style="color:var(--accent-pitch); font-weight:900;">*</span>' : ''}</td>
                  <td style="color: var(--text-dim); font-size: 0.78rem;">${b.dismissalText || (b.status === 'batting' ? 'not out' : 'yet to bat')}</td>
                  <td class="num"><strong>${b.runs}</strong></td>
                  <td class="num">${b.balls}</td>
                  <td class="num">${b.fours}</td>
                  <td class="num">${b.sixes}</td>
                  <td class="num">${b.strikeRate}</td>
                </tr>
              `).join('') : '<tr><td colspan="7" style="text-align:center; color:var(--text-dim); padding:10px;">Yet to bat</td></tr>'}
            </tbody>
          </table>

          <!-- Extras Bar -->
          <div class="scorecard-extras-bar">
            <strong>Extras:</strong> ${inn.extras.total} (wd ${inn.extras.wides}, nb ${inn.extras.noBalls}, b ${inn.extras.byes}, lb ${inn.extras.legByes}, pen ${inn.extras.penalty})
          </div>

          <!-- Bowling Table -->
          <div class="table-section-title">🎯 Bowling (vs ${bowlTeam.name})</div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th class="num">O</th>
                <th class="num">M</th>
                <th class="num">R</th>
                <th class="num">W</th>
                <th class="num">Econ</th>
              </tr>
            </thead>
            <tbody>
              ${bowlersList.length > 0 ? bowlersList.map(bw => `
                <tr>
                  <td><strong>${bw.name}</strong></td>
                  <td class="num">${bw.oversFormatted}</td>
                  <td class="num">${bw.maidens}</td>
                  <td class="num"><strong>${bw.runsConceded}</strong></td>
                  <td class="num"><strong style="color: var(--accent-wicket);">${bw.wickets}</strong></td>
                  <td class="num">${bw.economy}</td>
                </tr>
              `).join('') : '<tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:10px;">Yet to bowl</td></tr>'}
            </tbody>
          </table>

          <!-- Fall of Wickets -->
          ${inn.fallOfWickets.length > 0 ? `
            <div class="table-section-title" style="margin-top: 12px;">📉 Fall of Wickets</div>
            <div class="fow-summary-strip">
              ${inn.fallOfWickets.map(f => `<span><strong>${f.score}/${f.wicket}</strong> (${f.batterName}, ${f.overs} ov)</span>`).join(' • ')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Render Full Scorecard Tab (Side by Side with White Background & Blue Borders)
  function renderFullScorecard() {
    if (!engine.state) return;
    const inn1 = engine.state.innings[0];
    const inn2 = engine.state.innings[1];

    let html = '<div class="match-end-scorecards-grid">';
    html += generateTeamScorecardHTML(inn1, 0);
    if (engine.state.currentInningsIndex >= 1 && inn2) {
      html += generateTeamScorecardHTML(inn2, 1);
    }
    html += '</div>';

    fullScorecardContainer.innerHTML = html;
  }

  // Render Commentary Tab
  function renderCommentary(innings) {
    if (innings.deliveries.length === 0) {
      commentaryList.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 20px;">No deliveries bowled yet.</p>';
      return;
    }

    const reversed = [...innings.deliveries].reverse();
    commentaryList.innerHTML = reversed.map(d => {
      const overText = `${d.overNumber}.${d.ballInOver}`;
      let badgeClass = 'ball-run';
      if (d.isWicket) badgeClass = 'ball-wicket';
      else if (d.runsBat === 4) badgeClass = 'ball-four';
      else if (d.runsBat === 6) badgeClass = 'ball-six';
      else if (d.extraType) badgeClass = 'ball-extra';
      else if (d.runsBat === 0) badgeClass = 'ball-dot';

      return `
        <div class="comm-item">
          <div class="comm-over">${overText}</div>
          <div class="ball-badge ${badgeClass}" style="width: 30px; height: 30px; font-size: 0.75rem;">${d.badge}</div>
          <div class="comm-body">
            <div class="comm-text">${d.commentary}</div>
            <div class="comm-meta">${d.totalRuns} run${d.totalRuns === 1 ? '' : 's'} off delivery</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Fall of Wickets & Extras Tab
  function renderFallOfWicketsAndExtras(innings) {
    if (innings.fallOfWickets.length === 0) {
      fowList.innerHTML = '<em>No wickets have fallen yet.</em>';
    } else {
      fowList.innerHTML = innings.fallOfWickets.map(f => `
        <div style="padding: 6px 10px; background: rgba(244, 63, 94, 0.08); border-left: 3px solid var(--accent-wicket); border-radius: 4px;">
          <strong>${f.score}/${f.wicket}</strong> (${f.batterName}, ${f.batterRuns} runs) at ${f.overs} ov
        </div>
      `).join('');
    }

    extrasBreakdown.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between;"><span>Wides:</span> <strong>${innings.extras.wides}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>No Balls:</span> <strong>${innings.extras.noBalls}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Byes:</span> <strong>${innings.extras.byes}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Leg Byes:</span> <strong>${innings.extras.legByes}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Penalty:</span> <strong>${innings.extras.penalty}</strong></div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-glass); padding-top: 6px; font-weight: 800; color: var(--accent-extra);">
          <span>Total Extras:</span> <span>${innings.extras.total}</span>
        </div>
      </div>
    `;
  }

  // ===================================================================
  // 5. LIVE SCORING ACTIONS & INTERACTION
  // ===================================================================
  
  // Quick Runs (0, 1, 2, 3, 4, 6)
  scoreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const runs = parseInt(btn.dataset.run, 10);
      handleDelivery({
        runsBat: runs,
        isBoundary: (runs === 4 || runs === 6)
      });

      if (runs === 4 && window.soundEffects) window.soundEffects.playFour();
      else if (runs === 6 && window.soundEffects) window.soundEffects.playSix();
      else if (runs > 0 && window.soundEffects) window.soundEffects.playRun();
      else if (window.soundEffects) window.soundEffects.playTap();
    });
  });

  // Quick Extras (Wide, No Ball, Bye, Leg Bye, Penalty)
  extraButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const extraType = btn.dataset.extra;
      if (extraType === 'wide') {
        handleDelivery({ extraType: 'wide', extraRuns: 0 });
      } else if (extraType === 'noBall') {
        handleDelivery({ extraType: 'noBall', runsBat: 0, extraRuns: 0 });
      } else if (extraType === 'bye') {
        handleDelivery({ extraType: 'bye', extraRuns: 1 });
      } else if (extraType === 'legBye') {
        handleDelivery({ extraType: 'legBye', extraRuns: 1 });
      } else if (extraType === 'penalty') {
        handleDelivery({ extraType: 'penalty', extraRuns: 5 });
      }
      if (window.soundEffects) window.soundEffects.playTap();
    });
  });

  // Manual Strike Swap button
  btnManualSwapStrike.addEventListener('click', () => {
    engine.swapStrike();
    StorageManager.saveMatch(engine.state);
    if (window.soundEffects) window.soundEffects.playTap();
    renderScoreboard();
  });

  // Mid-over change bowler
  btnChangeBowlerMidOver.addEventListener('click', () => {
    showBowlerModal();
  });

  // Undo Ball
  btnUndoBall.addEventListener('click', () => {
    if (engine.undoLastDelivery()) {
      StorageManager.saveMatch(engine.state);
      if (window.soundEffects) window.soundEffects.playUndo();
      renderScoreboard();
    }
  });

  // Core Delivery Handler
  function handleDelivery(deliveryConfig) {
    if (!engine.state) return;
    const innings = engine.getCurrentInnings();

    // Ensure we have a bowler selected
    if (!innings.currentBowlerId) {
      showBowlerModal();
      return;
    }

    const result = engine.recordDelivery(deliveryConfig);
    StorageManager.saveMatch(engine.state);
    renderScoreboard();

    // Check if match finished (Both 1st and 2nd innings ended)
    if (result.matchCompleted) {
      if (window.soundEffects) window.soundEffects.playOverEnd();
      renderScoreboard();
      showMatchResultModal();
      return;
    }

    // Check if 1st innings finished (Required chosen overs completed or all out)
    if (engine.state.currentInningsIndex === 0 && (innings.isCompleted || (engine.state.format !== 'test' && innings.legalBallsBowled >= engine.state.maxOvers * 6))) {
      innings.isCompleted = true;
      if (window.soundEffects) window.soundEffects.playOverEnd();
      renderScoreboard();
      return;
    }

    // Check if new batter needed after wicket
    if (result.nextBatterPromptNeeded) {
      showNextBatterModal(result.isStrikerOut);
      return;
    }

    // Check if over completed
    if (result.overCompleted) {
      if (window.soundEffects) window.soundEffects.playOverEnd();
      showBowlerModal();
    }
  }

  // ===================================================================
  // 6. MODALS LOGIC (WICKET, BOWLER, COMBO, RESULT)
  // ===================================================================

  // Wicket Trigger
  btnWicketModal.addEventListener('click', () => {
    const innings = engine.getCurrentInnings();
    if (!innings.currentBowlerId) {
      showBowlerModal();
      return;
    }

    // Populate fielders list (bowling team)
    const bowlingTeam = engine.getBowlingTeam();
    selectFielder.innerHTML = `<option value="">-- None / Bowler Unassisted --</option>` +
      bowlingTeam.players.map(p => `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`).join('');

    // Populate remaining batters
    populateNextBatterSelect();

    // Reset fields
    wicketTypeSelect.value = 'bowled';
    updateWicketFieldVisibility();
    outIsStriker = true;
    optStrikerOut.classList.add('active');
    optNonStrikerOut.classList.remove('active');

    wicketModal.classList.add('show');
    if (window.soundEffects) window.soundEffects.playTap();
  });

  btnCloseWicketModal.addEventListener('click', () => {
    wicketModal.classList.remove('show');
  });

  // Toggle Out Batter Striker vs Non-Striker
  optStrikerOut.addEventListener('click', () => {
    outIsStriker = true;
    optStrikerOut.classList.add('active');
    optNonStrikerOut.classList.remove('active');
  });

  optNonStrikerOut.addEventListener('click', () => {
    outIsStriker = false;
    optNonStrikerOut.classList.add('active');
    optStrikerOut.classList.remove('active');
  });

  wicketTypeSelect.addEventListener('change', updateWicketFieldVisibility);

  function updateWicketFieldVisibility() {
    const type = wicketTypeSelect.value;
    const needsFielder = ['caught', 'stumped', 'runOut'].includes(type);
    fielderGroup.style.display = needsFielder ? 'block' : 'none';
    runOutOptionsGroup.style.display = type === 'runOut' ? 'block' : 'none';
  }

  // ===================================================================
  // CUSTOM PLAYER PROMPT MODAL (REPLACES BROWSER PROMPT)
  // ===================================================================
  let playerPromptResolve = null;

  function showPlayerPrompt(title, defaultValue = '', placeholder = '', hint = '') {
    return new Promise((resolve) => {
      playerPromptResolve = resolve;
      playerPromptTitle.textContent = title;
      playerPromptInput.value = defaultValue;
      playerPromptInput.placeholder = placeholder || 'Enter player name';
      playerPromptHint.textContent = hint || '';
      playerPromptHint.style.color = 'var(--text-muted)';
      playerPromptModal.classList.add('show');
      setTimeout(() => {
        playerPromptInput.focus();
        playerPromptInput.select();
      }, 50);
    });
  }

  function closePlayerPrompt(val = null) {
    playerPromptModal.classList.remove('show');
    if (playerPromptResolve) {
      playerPromptResolve(val);
      playerPromptResolve = null;
    }
  }

  if (btnClosePlayerPromptModal) btnClosePlayerPromptModal.addEventListener('click', () => closePlayerPrompt(null));
  if (btnCancelPlayerPrompt) btnCancelPlayerPrompt.addEventListener('click', () => closePlayerPrompt(null));

  if (playerPromptForm) {
    playerPromptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = playerPromptInput.value.trim();
      if (!val) {
        playerPromptHint.textContent = 'Please enter a valid player name.';
        playerPromptHint.style.color = '#ef4444';
        return;
      }
      closePlayerPrompt(val);
    });
  }

  // ===================================================================
  // INCOMING PLAYER MANAGEMENT (ADD, EDIT, REMOVE, CHANGE)
  // ===================================================================

  function populateNextBatterSelect(preferredId = null) {
    const available = engine.getAvailableBatters();
    if (available.length === 0) {
      nextBatterGroup.style.display = 'none';
      selectNextBatter.required = false;
    } else {
      nextBatterGroup.style.display = 'block';
      selectNextBatter.required = true;
      selectNextBatter.innerHTML = available.map(p => `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`).join('');
      if (preferredId) {
        selectNextBatter.value = preferredId;
      }
    }
  }

  function populateStandaloneNextBatterSelect(preferredId = null) {
    if (!selectStandaloneNextBatter) return;
    const available = engine.getAvailableBatters();
    if (available.length === 0) {
      selectStandaloneNextBatter.innerHTML = '<option value="">-- No available bench players --</option>';
      selectStandaloneNextBatter.disabled = true;
    } else {
      selectStandaloneNextBatter.disabled = false;
      selectStandaloneNextBatter.innerHTML = available.map(p => `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`).join('');
      if (preferredId) {
        selectStandaloneNextBatter.value = preferredId;
      }
    }
  }

  function populateReplacementBatterSelect(preferredId = null) {
    if (!selectReplacementBatter) return;
    const available = engine.getAvailableBatters();
    if (available.length === 0) {
      selectReplacementBatter.innerHTML = '<option value="">-- No available bench players --</option>';
      selectReplacementBatter.disabled = true;
      if (btnConfirmReplaceBatter) btnConfirmReplaceBatter.disabled = true;
    } else {
      selectReplacementBatter.disabled = false;
      if (btnConfirmReplaceBatter) btnConfirmReplaceBatter.disabled = false;
      selectReplacementBatter.innerHTML = available.map(p => `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`).join('');
      if (preferredId) {
        selectReplacementBatter.value = preferredId;
      }
    }
  }

  // Helper to re-populate all incoming player dropdowns
  function refreshAllIncomingPlayerSelects(preferredId = null) {
    populateNextBatterSelect(preferredId);
    populateStandaloneNextBatterSelect(preferredId);
    populateReplacementBatterSelect(preferredId);
  }

  // ADD INCOMING PLAYER
  async function handleAddIncomingPlayer(targetSelect) {
    const battingTeam = engine.getBattingTeam();
    const teamName = battingTeam ? (battingTeam.shortName || battingTeam.name) : 'team';
    const name = await showPlayerPrompt(
      `➕ Add New Player to ${teamName}`,
      '',
      'e.g. Kamran or Abubakar Dar',
      'The new player will be added to the squad and selected immediately.'
    );

    if (!name) return;

    const newPlayer = engine.addPlayerToBattingTeam(name);
    if (newPlayer) {
      StorageManager.saveMatch(engine.state);
      refreshAllIncomingPlayerSelects(newPlayer.id);
      if (targetSelect) {
        targetSelect.value = newPlayer.id;
      }
      renderScoreboard();
      if (window.soundEffects) window.soundEffects.playTap();
    }
  }

  // EDIT INCOMING PLAYER NAME
  async function handleEditIncomingPlayer(targetSelect) {
    const playerId = targetSelect ? targetSelect.value : null;
    if (!playerId) {
      alert('Please select a player to edit.');
      return;
    }
    const player = engine.getPlayer(playerId);
    if (!player) return;

    const newName = await showPlayerPrompt(
      `✏️ Edit Player Name`,
      player.name,
      'Enter new player name',
      `Updating will correct this player's name across the scoreboard.`
    );

    if (!newName || newName === player.name) return;

    const updated = engine.editPlayerName(playerId, newName);
    if (updated) {
      StorageManager.saveMatch(engine.state);
      refreshAllIncomingPlayerSelects(playerId);
      renderScoreboard();
      if (window.soundEffects) window.soundEffects.playTap();
    }
  }

  // REMOVE INCOMING PLAYER FROM SQUAD
  function handleRemoveIncomingPlayer(targetSelect) {
    const playerId = targetSelect ? targetSelect.value : null;
    if (!playerId) {
      alert('Please select a player to remove.');
      return;
    }
    const player = engine.getPlayer(playerId);
    if (!player) return;

    const confirmRemove = confirm(`Are you sure you want to remove "${player.name}" from the squad? They will no longer be available to bat.`);
    if (!confirmRemove) return;

    const res = engine.removePlayerFromBattingTeam(playerId);
    if (res.success) {
      StorageManager.saveMatch(engine.state);
      refreshAllIncomingPlayerSelects();
      renderScoreboard();
      if (window.soundEffects) window.soundEffects.playTap();
    } else {
      alert(res.reason || 'Could not remove player.');
    }
  }

  // Wire up Wicket Modal Incoming Player Action Buttons
  if (btnAddNextBatterWicket) {
    btnAddNextBatterWicket.addEventListener('click', () => handleAddIncomingPlayer(selectNextBatter));
  }
  if (btnEditNextBatterWicket) {
    btnEditNextBatterWicket.addEventListener('click', () => handleEditIncomingPlayer(selectNextBatter));
  }
  if (btnRemoveNextBatterWicket) {
    btnRemoveNextBatterWicket.addEventListener('click', () => handleRemoveIncomingPlayer(selectNextBatter));
  }

  // Wire up Dedicated Next Batter Modal Buttons
  if (btnAddNextBatterModal) {
    btnAddNextBatterModal.addEventListener('click', () => handleAddIncomingPlayer(selectStandaloneNextBatter));
  }
  if (btnEditNextBatterModal) {
    btnEditNextBatterModal.addEventListener('click', () => handleEditIncomingPlayer(selectStandaloneNextBatter));
  }
  if (btnRemoveNextBatterModal) {
    btnRemoveNextBatterModal.addEventListener('click', () => handleRemoveIncomingPlayer(selectStandaloneNextBatter));
  }
  if (btnCloseNextBatterModal) {
    btnCloseNextBatterModal.addEventListener('click', () => {
      nextBatterModal.classList.remove('show');
    });
  }

  // End Selector in Next Batter Modal
  if (nextBatterEndSelector) {
    nextBatterEndSelector.querySelectorAll('.pill-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        nextBatterEndSelector.querySelectorAll('.pill-opt').forEach(p => p.classList.remove('active'));
        opt.classList.add('active');
        nextBatterPendingSlot = (opt.dataset.end === 'striker');
      });
    });
  }

  // Show Next Batter Modal (Dedicated modal for incoming batsman)
  function showNextBatterModal(isStrikerSlot) {
    nextBatterPendingSlot = isStrikerSlot;
    populateStandaloneNextBatterSelect();

    if (nextBatterEndSelector) {
      nextBatterEndSelector.querySelectorAll('.pill-opt').forEach(opt => {
        const matches = (opt.dataset.end === 'striker') === isStrikerSlot;
        opt.classList.toggle('active', matches);
      });
    }

    nextBatterModal.classList.add('show');
  }

  // Submit Next Batter Form
  if (nextBatterForm) {
    nextBatterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nextBatterId = selectStandaloneNextBatter.value;
      if (!nextBatterId) {
        alert('Please choose or add an incoming batsman.');
        return;
      }

      engine.setNewBatter(nextBatterId, nextBatterPendingSlot);
      StorageManager.saveMatch(engine.state);
      nextBatterModal.classList.remove('show');
      renderScoreboard();
      if (window.soundEffects) window.soundEffects.playTap();
    });
  }

  // ===================================================================
  // ON-FIELD BATTERS MANAGEMENT (CHANGE / EDIT / REPLACE AT CREASE)
  // ===================================================================

  function updateManageBattersDisplay() {
    const innings = engine.getCurrentInnings();
    if (!innings) return;
    const isStriker = manageBatterSelectedSlot === 'striker';
    const batterId = isStriker ? innings.currentStrikerId : innings.currentNonStrikerId;
    const player = batterId ? engine.getPlayer(batterId) : null;
    const batterStat = batterId ? engine.getOrCreateBatter(batterId) : null;

    if (player && batterStat) {
      displayManageBatterName.textContent = `${isStriker ? '* ' : ''}${player.displayName || player.name} (${isStriker ? "Striker" : "Non-Striker"})`;
      displayManageBatterStats.textContent = `${batterStat.runs} runs from ${batterStat.balls} balls (${batterStat.fours}x4, ${batterStat.sixes}x6, SR: ${batterStat.strikeRate})`;
    } else {
      displayManageBatterName.textContent = 'None currently at crease';
      displayManageBatterStats.textContent = '';
    }

    if (optManageStriker) optManageStriker.classList.toggle('active', isStriker);
    if (optManageNonStriker) optManageNonStriker.classList.toggle('active', !isStriker);
  }

  function openManageBattersModal(slot = 'striker') {
    manageBatterSelectedSlot = slot;
    if (replaceBatterSection) replaceBatterSection.style.display = 'none';
    updateManageBattersDisplay();
    if (manageBattersModal) manageBattersModal.classList.add('show');
  }

  if (btnManageBatters) {
    btnManageBatters.addEventListener('click', () => openManageBattersModal('striker'));
  }
  if (btnCloseManageBattersModal) {
    btnCloseManageBattersModal.addEventListener('click', () => {
      manageBattersModal.classList.remove('show');
    });
  }

  if (optManageStriker) {
    optManageStriker.addEventListener('click', () => {
      manageBatterSelectedSlot = 'striker';
      updateManageBattersDisplay();
    });
  }
  if (optManageNonStriker) {
    optManageNonStriker.addEventListener('click', () => {
      manageBatterSelectedSlot = 'nonStriker';
      updateManageBattersDisplay();
    });
  }

  // Trigger Edit Name for active batter
  if (btnTriggerEditActiveBatter) {
    btnTriggerEditActiveBatter.addEventListener('click', async () => {
      const innings = engine.getCurrentInnings();
      if (!innings) return;
      const isStriker = manageBatterSelectedSlot === 'striker';
      const batterId = isStriker ? innings.currentStrikerId : innings.currentNonStrikerId;
      if (!batterId) return;
      const player = engine.getPlayer(batterId);
      if (!player) return;

      const newName = await showPlayerPrompt(
        `✏️ Edit Batter Name`,
        player.name,
        'Enter new player name',
        'This will update the player name on the live scoreboard and scorecard.'
      );

      if (!newName || newName === player.name) return;

      engine.editPlayerName(batterId, newName);
      StorageManager.saveMatch(engine.state);
      updateManageBattersDisplay();
      renderScoreboard();
    });
  }

  // Trigger Replace Active Batter
  if (btnTriggerReplaceActiveBatter) {
    btnTriggerReplaceActiveBatter.addEventListener('click', () => {
      if (replaceBatterSection.style.display === 'none') {
        replaceBatterSection.style.display = 'block';
        populateReplacementBatterSelect();
      } else {
        replaceBatterSection.style.display = 'none';
      }
    });
  }

  // Add new player from replacement section
  if (btnAddReplacementPlayer) {
    btnAddReplacementPlayer.addEventListener('click', () => handleAddIncomingPlayer(selectReplacementBatter));
  }

  // Confirm replacement
  if (btnConfirmReplaceBatter) {
    btnConfirmReplaceBatter.addEventListener('click', () => {
      const innings = engine.getCurrentInnings();
      if (!innings) return;
      const isStriker = manageBatterSelectedSlot === 'striker';
      const oldBatterId = isStriker ? innings.currentStrikerId : innings.currentNonStrikerId;
      const newBatterId = selectReplacementBatter.value;

      if (!newBatterId) {
        alert('Please select a replacement player.');
        return;
      }

      const success = engine.changeActiveBatter(oldBatterId, newBatterId);
      if (success) {
        StorageManager.saveMatch(engine.state);
        manageBattersModal.classList.remove('show');
        renderScoreboard();
        if (window.soundEffects) window.soundEffects.playTap();
      }
    });
  }

  // Table inline delegation for edit and change icons on battersTableBody
  if (battersTableBody) {
    battersTableBody.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.btn-table-edit-batter');
      if (editBtn) {
        const playerId = editBtn.dataset.id;
        const player = engine.getPlayer(playerId);
        if (!player) return;
        const newName = await showPlayerPrompt(
          `✏️ Edit Batter Name`,
          player.name,
          'Enter player name'
        );
        if (newName && newName !== player.name) {
          engine.editPlayerName(playerId, newName);
          StorageManager.saveMatch(engine.state);
          renderScoreboard();
        }
        return;
      }

      const changeBtn = e.target.closest('.btn-table-change-batter');
      if (changeBtn) {
        const slot = changeBtn.dataset.slot || 'striker';
        openManageBattersModal(slot);
      }
    });
  }

  // Wicket form submit
  wicketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const innings = engine.getCurrentInnings();
    const type = wicketTypeSelect.value;
    const dismissedBatterId = outIsStriker ? innings.currentStrikerId : innings.currentNonStrikerId;
    const nextBatterId = selectNextBatter.value;
    const runsCompleted = parseInt(runOutCompletedRuns.value, 10) || 0;
    const crossed = runOutCrossedCheck.checked;

    wicketModal.classList.remove('show');

    if (window.soundEffects) window.soundEffects.playWicket();

    // Record delivery with wicket
    const result = engine.recordDelivery({
      runsBat: type === 'runOut' ? runsCompleted : 0,
      isWicket: true,
      wicketDetails: {
        type,
        batterOutId: dismissedBatterId,
        fielderId: selectFielder.value || null,
        isStrikerOut: outIsStriker,
        crossed
      }
    });

    // If new batter is selected, bring them in
    if (nextBatterId && !result.matchCompleted && !innings.isCompleted) {
      engine.setNewBatter(nextBatterId, outIsStriker);
    }

    StorageManager.saveMatch(engine.state);
    renderScoreboard();

    if (result.matchCompleted) {
      showMatchResultModal();
    } else if (engine.state.currentInningsIndex === 0 && innings.isCompleted) {
      handleInningsBreak();
    } else if (result.nextBatterPromptNeeded) {
      showNextBatterModal(result.isStrikerOut);
    } else if (result.overCompleted) {
      if (window.soundEffects) window.soundEffects.playOverEnd();
      showBowlerModal();
    }
  });

  // Bowler Selection Modal
  function showBowlerModal() {
    const available = engine.getAvailableBowlers();
    if (available.length === 0) {
      alert('No eligible bowlers remaining under over restrictions.');
      return;
    }

    selectNewBowler.innerHTML = available.map(p => {
      const stats = engine.getCurrentInnings().bowlers[p.id];
      const oversBowled = stats ? stats.oversFormatted : '0.0';
      const label = p.selectorLabel || p.displayName || p.name;
      return `<option value="${p.id}">${label} (${oversBowled} ov bowled)</option>`;
    }).join('');

    bowlerModal.classList.add('show');
  }

  bowlerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bowlerId = selectNewBowler.value;
    try {
      engine.setNewBowler(bowlerId);
      StorageManager.saveMatch(engine.state);
      bowlerModal.classList.remove('show');
      if (window.soundEffects) window.soundEffects.playTap();
      renderScoreboard();
    } catch (err) {
      alert(err.message);
    }
  });

  // Delivery Combo / Adjustment Modal
  btnCustomCombo.addEventListener('click', () => {
    comboModal.classList.add('show');
    if (window.soundEffects) window.soundEffects.playTap();
  });

  btnCloseComboModal.addEventListener('click', () => {
    comboModal.classList.remove('show');
  });

  comboForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const extraType = comboExtraType.value === 'none' ? null : comboExtraType.value;
    const runsBat = parseInt(comboRunsBat.value, 10) || 0;
    const extraRuns = parseInt(comboExtraRuns.value, 10) || 0;

    comboModal.classList.remove('show');

    handleDelivery({
      runsBat,
      extraType,
      extraRuns,
      isBoundary: (runsBat === 4 || runsBat === 6)
    });

    if (runsBat === 4 && window.soundEffects) window.soundEffects.playFour();
    else if (runsBat === 6 && window.soundEffects) window.soundEffects.playSix();
    else if (window.soundEffects) window.soundEffects.playRun();
  });

  // Innings Break Transition (Directly Shift to Next Team & Show Total to Chase)
  function handleInningsBreak() {
    const inn1 = engine.state.innings[0];
    const inn2 = engine.state.innings[1];
    const target = inn1.totalRuns + 1;
    inn2.target = target;
    
    // Play celebratory break chime
    if (window.soundEffects) window.soundEffects.playOverEnd();

    // Prepare 2nd Innings Batting Team (Next Team) and Bowling Team
    const nextBattingTeam = inn2.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
    const nextBowlingTeam = inn2.bowlingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
    const firstTeam = inn1.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;

    // Populate Innings Break UI elements
    breakFirstTeamScore.textContent = `${firstTeam.name}: ${inn1.totalRuns}/${inn1.wickets}`;
    breakFirstTeamOvers.textContent = `(${engine.formatOvers(inn1.legalBallsBowled)} / ${engine.state.maxOvers} ov)`;
    breakTargetRuns.textContent = target;
    btnBreakTargetVal.textContent = target;

    const ballsRemaining = engine.state.maxOvers * 6;
    const rrr = ((target / ballsRemaining) * 6).toFixed(2);
    breakChaseDetails.textContent = `${nextBattingTeam.name} needs ${target} runs in ${engine.state.maxOvers} overs (${ballsRemaining} balls) to win`;
    breakRRRText.textContent = `Required Run Rate: ${rrr} RRR`;

    // Populate Next Team Openers dropdowns:
    // Striker: Next Team Player 1
    // Non-Striker: Next Team Player 2
    // Opening Bowler: Bowling Team Player 1
    breakStrikerSelect.innerHTML = nextBattingTeam.players.map(p => 
      `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`
    ).join('');
    
    breakNonStrikerSelect.innerHTML = nextBattingTeam.players.map((p, idx) => 
      `<option value="${p.id}" ${idx === 1 ? 'selected' : ''}>${p.selectorLabel || p.displayName || p.name}</option>`
    ).join('');

    breakOpeningBowlerSelect.innerHTML = nextBowlingTeam.players.map(p => 
      `<option value="${p.id}">${p.selectorLabel || p.displayName || p.name}</option>`
    ).join('');

    // Show Innings Break Modal
    inningsBreakModal.classList.add('show');
  }

  // Handle Next Team Openers Confirmation
  if (inningsBreakForm) {
    inningsBreakForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const strikerId = breakStrikerSelect.value;
      const nonStrikerId = breakNonStrikerSelect.value;
      const bowlerId = breakOpeningBowlerSelect.value;

      if (strikerId === nonStrikerId) {
        alert('Striker and Non-Striker must be two different players!');
        return;
      }

      // DIRECTLY SHIFT TO NEXT TEAM (2nd Innings)!
      engine.startSecondInnings(strikerId, nonStrikerId, bowlerId);
      StorageManager.saveMatch(engine.state);

      inningsBreakModal.classList.remove('show');
      if (window.soundEffects) window.soundEffects.playTap();

      // Re-render scoreboard for Next Team!
      renderScoreboard();
    });
  }

  // End 1st Innings / Declare Button Click
  if (btnDeclare1stInnings) {
    btnDeclare1stInnings.addEventListener('click', () => {
      const inn1 = engine.state.innings[0];
      const target = inn1.totalRuns + 1;
      if (confirm(`End 1st Innings now and shift directly to next team to chase ${target} runs?`)) {
        engine.endFirstInnings();
        StorageManager.saveMatch(engine.state);
        renderScoreboard();
        handleInningsBreak();
      }
    });
  }

  // Trigger Next Inning action
  function handleNextInningClick() {
    if (!engine.state) return;
    if (engine.state.currentInningsIndex !== 0) {
      alert('1st innings is already completed. The match is currently in the 2nd innings.');
      return;
    }

    const canProceed = engine.canProceedToNextInnings();
    if (canProceed.allowed) {
      // Completed chosen overs, all out, or declared -> Proceed directly!
      if (window.soundEffects) window.soundEffects.playTap();
      handleInningsBreak();
    } else {
      // Chosen overs not yet completed: notify and give option to declare early
      const inn1 = engine.state.innings[0];
      const completedOvers = engine.formatOvers(inn1.legalBallsBowled);
      const targetIfEnded = inn1.totalRuns + 1;
      const userChoice = confirm(
        `NEXT INNING ACTIVATION INFO:\n\n` +
        `• Next Inning works automatically after completing the chosen ${engine.state.maxOvers} overs.\n` +
        `• Current Progress: ${completedOvers} of ${engine.state.maxOvers} overs bowled (${inn1.totalRuns}/${inn1.wickets}).\n\n` +
        `Would you like to declare / end the 1st innings early now and set the target to ${targetIfEnded} runs?`
      );

      if (userChoice) {
        engine.endFirstInnings();
        StorageManager.saveMatch(engine.state);
        renderScoreboard();
        handleInningsBreak();
      }
    }
  }

  // Trigger Match End action
  function handleMatchEndClick() {
    if (!engine.state) return;

    const bothEnded = engine.areBothInningsEnded();
    if (bothEnded) {
      // Both innings have ended! Open match presentation
      if (window.soundEffects && typeof window.soundEffects.playOverEnd === 'function') {
        window.soundEffects.playOverEnd();
      }
      showMatchResultModal();
    } else {
      if (engine.state.currentInningsIndex === 0) {
        const inn1 = engine.state.innings[0];
        const overs = engine.formatOvers(inn1.legalBallsBowled);
        alert(
          `MATCH END REQUIREMENT:\n\n` +
          `The MATCH END button works only after BOTH the 1st and 2nd innings have ended.\n\n` +
          `Current Status: In 1st Innings (${overs}/${engine.state.maxOvers} overs bowled).\n` +
          `Please complete the 1st innings and 2nd innings to unlock Match End.`
        );
      } else {
        // In 2nd innings
        const inn1 = engine.state.innings[0];
        const inn2 = engine.state.innings[1];
        const team1 = inn1.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
        const team2 = inn2.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
        const runsNeeded = Math.max(0, inn2.target - inn2.totalRuns);
        const ballsRemaining = Math.max(0, (engine.state.maxOvers * 6) - inn2.legalBallsBowled);

        const confirmEnd = confirm(
          `MATCH END REQUIREMENT:\n\n` +
          `Match End normally activates automatically once the 2nd innings ends (Target reached, overs completed, or all out).\n\n` +
          `Current Chase Status:\n` +
          `• ${team2.name} need ${runsNeeded} runs from ${ballsRemaining} balls (Target: ${inn2.target}).\n\n` +
          `Would you like to manually conclude and end the match now with the current scores?`
        );

        if (confirmEnd) {
          engine.concludeMatchEarly();
          StorageManager.saveMatch(engine.state);
          renderScoreboard();
          showMatchResultModal();
        }
      }
    }
  }

  // Next Inning Button Clicks
  if (btnNextInning) {
    btnNextInning.addEventListener('click', handleNextInningClick);
  }
  if (btnBannerNextInning) {
    btnBannerNextInning.addEventListener('click', handleNextInningClick);
  }

  // Match End Button Clicks
  if (btnMatchEnd) {
    btnMatchEnd.addEventListener('click', handleMatchEndClick);
  }
  if (btnBannerMatchEnd) {
    btnBannerMatchEnd.addEventListener('click', handleMatchEndClick);
  }

  // Match Result Modal (SIDE BY SIDE SCORECARDS OF BOTH TEAMS)
  function showMatchResultModal() {
    resultHeadline.textContent = engine.state.resultText || 'Match Finished!';
    resultSubtext.textContent = `Format: ${engine.state.format.toUpperCase()} (${engine.state.maxOvers} overs) • Match Concluded`;
    
    const inn1 = engine.state.innings[0];
    const inn2 = engine.state.innings[1];
    const team1 = inn1.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;
    const team2 = inn2.battingTeamId === 'teamA' ? engine.state.teamA : engine.state.teamB;

    resultScoreSummary.innerHTML = `
      <span style="color:#1d4ed8;">${team1.name}</span>: ${inn1.totalRuns}/${inn1.wickets} (${engine.formatOvers(inn1.legalBallsBowled)} ov) &nbsp;&nbsp;|&nbsp;&nbsp; 
      <span style="color:#2563eb;">${team2.name}</span>: ${inn2.totalRuns}/${inn2.wickets} (${engine.formatOvers(inn2.legalBallsBowled)} ov)
    `;

    // Populate SIDE BY SIDE scorecards of both teams
    if (matchEndScorecardsContainer) {
      matchEndScorecardsContainer.innerHTML = `
        ${generateTeamScorecardHTML(inn1, 0)}
        ${generateTeamScorecardHTML(inn2, 1)}
      `;
    }

    StorageManager.saveMatchToHistory(engine.state);
    matchResultModal.classList.add('show');
  }

  // Close result modal button
  if (btnCloseResultModal) {
    btnCloseResultModal.addEventListener('click', () => {
      matchResultModal.classList.remove('show');
    });
  }

  btnResultViewScorecard.addEventListener('click', () => {
    matchResultModal.classList.remove('show');
    // Switch to Full Scorecard Tab
    tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === 'tabScorecard'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tabScorecard'));
  });

  btnResultExport.addEventListener('click', () => {
    StorageManager.exportMatchJSON(engine.state);
  });

  btnResultNewMatch.addEventListener('click', () => {
    if (confirm('Start a new match? Current match data is saved in history.')) {
      matchResultModal.classList.remove('show');
      StorageManager.clearMatch();
      location.reload();
    }
  });

  // ===================================================================
  // 7. TABS NAVIGATION
  // ===================================================================
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(btn.dataset.tab);
      if (targetContent) targetContent.classList.add('active');

      if (window.soundEffects) window.soundEffects.playTap();
    });
  });

  // ===================================================================
  // 8. HEADER CONTROLS (SOUND, HISTORY, EXPORT, NEW MATCH)
  // ===================================================================
  btnSoundToggle.addEventListener('click', () => {
    if (window.soundEffects) {
      const isEnabled = window.soundEffects.toggleSound();
      btnSoundToggle.classList.toggle('active', isEnabled);
      btnSoundToggle.textContent = isEnabled ? '🔊' : '🔇';
    }
  });

  btnExport.addEventListener('click', () => {
    if (engine.state) {
      StorageManager.exportMatchJSON(engine.state);
    } else {
      alert('No active match to export.');
    }
  });

  btnNewMatch.addEventListener('click', () => {
    if (confirm('Reset and configure a new match? Make sure you have exported or finished current match.')) {
      StorageManager.clearMatch();
      location.reload();
    }
  });

  logoClick.addEventListener('click', () => {
    if (engine.state && !engine.state.isCompleted) {
      renderScoreboard();
    }
  });

  // History Modal
  btnHistory.addEventListener('click', () => {
    const list = StorageManager.getMatchHistory();
    if (list.length === 0) {
      historyListContainer.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 20px;">No saved matches yet.</p>';
    } else {
      historyListContainer.innerHTML = list.map(m => `
        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 4px;">
            <span>${m.date} - ${m.time}</span>
            <span style="color: var(--accent-pitch); font-weight: 700; text-transform: uppercase;">${m.format}</span>
          </div>
          <div style="font-weight: 800; font-size: 0.95rem; color: #fff; margin-bottom: 2px;">
            ${m.teamA} vs ${m.teamB}
          </div>
          <div style="font-size: 0.85rem; color: var(--accent-gold); margin-bottom: 6px;">
            ${m.result}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
            ${m.scoreSummary}
          </div>
        </div>
      `).join('');
    }
    historyModal.classList.add('show');
  });

  btnCloseHistoryModal.addEventListener('click', () => {
    historyModal.classList.remove('show');
  });

  // ===================================================================
  // 9. KEYBOARD SHORTCUTS FOR RAPID SCORING
  // ===================================================================
  window.addEventListener('keydown', (e) => {
    // Only trigger if no modal or text input is active
    if (document.querySelector('.modal-backdrop.show') || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      return;
    }

    if (e.key >= '0' && e.key <= '6' && e.key !== '5') {
      const runs = parseInt(e.key, 10);
      handleDelivery({ runsBat: runs, isBoundary: (runs === 4 || runs === 6) });
      if (runs === 4 && window.soundEffects) window.soundEffects.playFour();
      else if (runs === 6 && window.soundEffects) window.soundEffects.playSix();
      else if (runs > 0 && window.soundEffects) window.soundEffects.playRun();
      else if (window.soundEffects) window.soundEffects.playTap();
    } else if (e.key.toLowerCase() === 'w') {
      handleDelivery({ extraType: 'wide', extraRuns: 0 });
      if (window.soundEffects) window.soundEffects.playTap();
    } else if (e.key.toLowerCase() === 'n') {
      handleDelivery({ extraType: 'noBall', runsBat: 0, extraRuns: 0 });
      if (window.soundEffects) window.soundEffects.playTap();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (engine.undoLastDelivery()) {
        StorageManager.saveMatch(engine.state);
        if (window.soundEffects) window.soundEffects.playUndo();
        renderScoreboard();
      }
    }
  });

  // ===================================================================
  // 10. APP INITIALIZATION & AUTO-RESTORE
  // ===================================================================
  initOfflineServiceWorker();

  // Check if saved active match exists in localStorage
  const savedMatch = StorageManager.loadMatch();
  if (savedMatch && savedMatch.innings && savedMatch.innings[0]) {
    engine.loadState(savedMatch);
    setupView.style.display = 'none';
    liveScoringView.style.display = 'block';
    renderScoreboard();
  } else {
    setupView.style.display = 'block';
    liveScoringView.style.display = 'none';
  }
});
