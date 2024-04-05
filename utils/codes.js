const codes = {
  [NAME_INIT]000: { code: '[NAME_INIT]000', error: 'unkown_error' },
  [NAME_INIT]001: { code: '[NAME_INIT]001', message: 'ok' },

  [NAME_INIT]002: { code: '[NAME_INIT]002', error: 'Bad Parameters' },

  // examples
  [NAME_INIT]003: { code: '[NAME_INIT]003', error: 'Type error: jwt' },
  [NAME_INIT]004: { code: '[NAME_INIT]004', error: 'Type error: axios' },
  [NAME_INIT]005: { code: '[NAME_INIT]005', error: 'Type error: db duplicate key' },
  [NAME_INIT]006: { code: '[NAME_INIT]006', error: 'No {modelName} found' },

  [NAME_INIT]100: { code: '[NAME_INIT]100', error: 'Correct Test' }
}

module.exports = codes
