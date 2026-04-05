// Mock data and configurations for TicTacGlow
const MOCK_DATA = {
    gameModes: [
        { id: 1, name: 'Player vs AI', description: 'Play against computer opponent' },
        { id: 2, name: 'Player vs Player', description: 'Local two-player game' }
    ],
    difficultyLevels: [
        { level: 'easy', label: 'Easy', description: 'AI makes random moves' },
        { level: 'medium', label: 'Medium', description: 'AI mixes random and smart moves' },
        { level: 'hard', label: 'Hard', description: 'AI tries to win or block' }
    ],
    initialScores: { xWins: 0, oWins: 0, draws: 0 },
    themeSettings: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#10b981',
        darkBackground: '#0f172a',
        glassEffect: 'rgba(255, 255, 255, 0.1)'
    }
};

// Export for use in app.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MOCK_DATA;
}