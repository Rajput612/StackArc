import React from 'react';
import { DIFFICULTY_STYLES } from '../../utils/constants';

const DifficultyBadge = ({ difficulty }) => (
  <span className={`px-3 py-1 rounded-full text-sm ${DIFFICULTY_STYLES[difficulty]}`}>
    {difficulty}
  </span>
);

export default DifficultyBadge;