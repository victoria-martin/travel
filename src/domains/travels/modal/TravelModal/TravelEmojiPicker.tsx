import { useState } from 'react';

// Suggestions only: the field below them takes any pasted emoji, and it is the value saveTravel reads.
const TRAVEL_EMOJIS = [
  ['🌵', '🪴', '🌴', '🎄'],
  ['🪩', '💒', '🎡', '🏕️', '🏜️', '🏟️'],
  ['🏎️', '🏍️', '🚲', '🛤️'],
  ['🧗‍♀️', '🏇', '⛷️', '🚣‍♀️', '🚴‍♀️'],
];

export function TravelEmojiPicker({ initialEmoji }: { initialEmoji: string }) {
  const [emoji, setEmoji] = useState(initialEmoji);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="emoji-picker">
      <button
        type="button"
        className="travel-modal-badge"
        id="travel-modal-badge"
        title="Changer l'emoji"
        onClick={() => setIsOpen((open) => !open)}
      >
        {emoji.trim() || '🧳'}
      </button>
      <div className="emoji-menu" id="travel-emoji-menu" hidden={!isOpen}>
        {TRAVEL_EMOJIS.map((row) => (
          <div className="emoji-row" key={row[0]}>
            {row.map((option) => (
              <button
                type="button"
                key={option}
                className={`emoji-option ${emoji.trim() === option ? 'selected' : ''}`}
                onClick={() => {
                  setEmoji(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ))}
        <input
          id="travel-emoji"
          type="text"
          value={emoji}
          maxLength={4}
          placeholder="Colle un emoji"
          onChange={(event) => setEmoji(event.target.value)}
        />
      </div>
    </div>
  );
}
