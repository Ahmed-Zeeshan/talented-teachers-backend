
const conn = require("../conn/connection.js");
const jwt = require("jsonwebtoken");



// Toggle double vote feature

// Toggle double vote feature
function toggle_double_vote(req, res) {
    // Retrieve the current state of the double vote feature from the configuration table
    conn.query(
      'SELECT double_vote_on_off FROM dbl_vote_configuration',
      (error, results) => {
        if (error) {
          console.error('Error retrieving double vote state:', error);
          return res.status(500).json({ error: 'Failed to toggle double vote' });
        }
  
        let currentState;
        if (results && results.length > 0) {
          currentState = results[0].double_vote_on_off;
        } else {
          // If no configuration row exists, assume the double vote feature is disabled
          currentState = 'off';
        }
  
        const newState = currentState === 'off' ? 'on' : 'off'; // Toggle the current state (on -> off, off -> on)
  
        // Update the double vote state in the configuration table
        conn.query(
          'INSERT INTO dbl_vote_configuration (config_id, double_vote_on_off) VALUES (?, ?) ON DUPLICATE KEY UPDATE double_vote_on_off = ?',
          [1, newState, newState],
          (error) => {
            if (error) {
              console.error('Error toggling double vote:', error);
              return res.status(500).json({ error: 'Failed to toggle double vote' });
            }
  
            res.status(200).json({ message: 'Double vote feature toggled successfully', enabled: newState });
          }
        );
      }
    );
  }
    



  module.exports = 
    {
        toggle_double_vote,
    
    };