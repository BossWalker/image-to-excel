module.exports = {
  'extends': [
    'airbnb-base'
  ],
  'rules': {
    'comma-dangle': 0,
    'camelcase': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': ['error', {
      'props': false
    }]
  },
  'plugins': [
  ],
  'globals': {
    'angular': 1,
    'document': 1
  }
}