// utils/ecoCoins.js
function calculateCoins(totalScore) {
  // totalScore is out of 100
  // give max 400 coins (~4 Rs), scale linearly
  return Math.floor(totalScore * 4 / 100); 
}

module.exports = calculateCoins;
