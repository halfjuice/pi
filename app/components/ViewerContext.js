import React from 'react';
import { createConsistentUserDB } from '../../models/client';

var __db = createConsistentUserDB();
export default {
  refresh: () => {
    __db = createConsistentUserDB();
  },

  db: () => __db,
};
