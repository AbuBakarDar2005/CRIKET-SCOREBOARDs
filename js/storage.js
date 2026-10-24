// LocalStorage & Export/Import Manager
const StorageManager = {
  ACTIVE_KEY: 'cricscore_active_match',
  HISTORY_KEY: 'cricscore_match_history',

  saveMatch(matchState) {
    try {
      if (!matchState) return;
      localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(matchState));
    } catch (e) {
      console.error('Error saving match state to localStorage:', e);
    }
  },

  loadMatch() {
    try {
      const data = localStorage.getItem(this.ACTIVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error loading match state from localStorage:', e);
      return null;
    }
  },

  clearMatch() {
    try {
      localStorage.removeItem(this.ACTIVE_KEY);
    } catch (e) {
      console.error('Error clearing active match:', e);
    }
  },

  exportMatchJSON(matchState) {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(matchState, null, 2));
      const downloadAnchor = document.createElement('a');
      const filename = `kashmiri_xi_${matchState.teamA?.name || 'teamA'}_vs_${matchState.teamB?.name || 'teamB'}_${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return true;
    } catch (e) {
      console.error('Failed to export match JSON:', e);
      return false;
    }
  },

  saveMatchToHistory(matchState) {
    try {
      if (!matchState || !matchState.isCompleted) return;
      let history = this.getMatchHistory();
      // Avoid duplicate saves by matchId or timestamp
      const matchId = matchState.id || (matchState.createdAt || Date.now());
      history = history.filter(m => m.id !== matchId);
      history.unshift({
        id: matchId,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        teamA: matchState.teamA.name,
        teamB: matchState.teamB.name,
        format: matchState.format,
        overs: matchState.overs,
        result: matchState.resultText,
        scoreSummary: `${matchState.teamA.name}: ${matchState.innings[0]?.totalRuns || 0}/${matchState.innings[0]?.wickets || 0} | ${matchState.teamB.name}: ${matchState.innings[1]?.totalRuns || 0}/${matchState.innings[1]?.wickets || 0}`,
        fullState: matchState
      });
      // Limit to 20 past matches
      if (history.length > 20) history.pop();
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save match to history:', e);
    }
  },

  getMatchHistory() {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error retrieving match history:', e);
      return [];
    }
  },

  clearHistory() {
    localStorage.removeItem(this.HISTORY_KEY);
  }
};

window.StorageManager = StorageManager;
