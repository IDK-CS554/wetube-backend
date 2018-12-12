/**
 * Pass in the roomIds list to get the next roomId to
 * use when a user wants to create a new room. This method
 * recycles numbers, so it returns the lowest postive number
 * not currently in use
 *
 * @param {Array} roomIds
 */
const nextRoomId = roomIds => {
  // we don't want a roomId of 0
  if (roomIds === []) return 1;
  else {
    // tempArr is to avoid mutating the roomIds arr
    let tempArr = Object.assign([], roomIds);
    // set all numbers < tempArr to negative.
    for (let i = 0; i < tempArr.length; i++) {
      // if abs val of curr val is lt tempArr.length,
      // set the val at that index to negative
      if (Math.abs(tempArr[i]) <= tempArr.length)
        tempArr[Math.abs(tempArr[i]) - 1] *= -1;
    }
    // iterate the tempArr, and if we encounter a
    // number that is not negative, then this is new
    // roomId, or if we get the end, then we return the tempArr.length
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i] > 0) return i + 1;
    }
    return tempArr.length + 1;
  }
};

module.exports = {
  nextRoomId
};
