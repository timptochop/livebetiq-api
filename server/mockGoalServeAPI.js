// server/mockGoalServeAPI.js
const express = require('express');
const router = express.Router();

// Helper functions
function calculateEV(odds1, odds2) {
  const prob1 = 1 / odds1;
  const prob2 = 1 / odds2;
  const totalProb = prob1 + prob2;
  const value = (Math.max(prob1, prob2) - totalProb / 2) * 100;
  return parseFloat(value.toFixed(2));
}

function estimateConfidence(odds1, odds2) {
  const diff = Math.abs(odds1 - odds2);
  const confidence = 100 - diff * 10;
  return parseFloat(Math.max(0, Math.min(confidence, 100)).toFixed(2));
}

function generateLabel(ev, conf) {
  if (ev > 8 && conf > 70) return 'SAFE';
  if (ev > 4 && conf > 50) return 'RISKY';
  if (ev <= 0) return 'AVOID';
  return 'STARTS SOON';
}

function generateNote(label, ev, conf) {
  if (label === 'SAFE') return 'Υψηλό EV και εμπιστοσύνη – καλή πρόβλεψη.';
  if (label === 'RISKY') return 'Υπάρχει αξία αλλά με ρίσκο.';
  if (label === 'AVOID') return 'Αρνητική αξία – απόφυγέ το.';
  return 'Αγώνας πλησιάζει – χωρίς πρόβλεψη.';
}

// Δεδομένα
const rawMatches = [
  { id: 1, player1: "Djokovic", player2: "Alcaraz", odds1: 1.40, odds2: 3.00 },
  { id: 2, player1: "Nadal", player2: "Medvedev", odds1: 2.00, odds2: 1.80 },
  { id: 3, player1: "Tsitsipas", player2: "Zverev", odds1: 1.80, odds2: 1.85 },
  { id: 4, player1: "Rune", player2: "Sinner", odds1: 2.50, odds2: 1.55 },
  { id: 5, player1: "Murray", player2: "Fritz", odds1: 1.60, odds2: 2.30 },
  { id: 6, player1: "Thiem", player2: "Rublev", odds1: 1.95, odds2: 1.90 },
  { id: 7, player1: "Kyrgios", player2: "Berrettini", odds1: 1.45, odds2: 2.80 }
];

// Προσθήκη EV, Confidence, Label, Note
const enrichedMatches = rawMatches.map((match) => {
  const ev = calculateEV(match.odds1, match.odds2);
  const confidence = estimateConfidence(match.odds1, match.odds2);
  const label = generateLabel(ev, confidence);
  const note = generateNote(label, ev, confidence);

  return {
    id: match.id,
    player1: match.player1,
    player2: match.player2,
    odds1: match.odds1,
    odds2: match.odds2,
    ev,
    confidence,
    label,
    note
  };
});

// ✅ Route: GET /api/predictions
router.get('/', (req, res) => {
  res.json(enrichedMatches);
});

module.exports = router;