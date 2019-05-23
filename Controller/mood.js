function mood(value) {
  if (value < 0.2) {
    return "Extreamly Sad"
  }
  if (value < 0.4) {
    return "Sad"
  }
  if (value < 0.6) {
    return "Normal"
  }
  if (value < 0.8) {
    return "Happy"
  }
  if (value < 1) {
    return "Extreamly Happy"
  }
}

module.exports = mood;