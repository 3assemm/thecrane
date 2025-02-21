/**
 * Calculates the boom angle required to reach a specific lift height and radius.
 *
 * @param {number} liftHeight - The vertical height of the lift.
 * @param {number} liftRadius - The horizontal distance from the crane to the load.
 * @returns {number} The calculated boom angle in degrees.
 */
export const calculateBoomAngle = (liftHeight: number, liftRadius: number): number => {
  // Calculate the angle using the arctangent function (atan2)
  const angleInRadians = Math.atan2(liftHeight, liftRadius);
  // Convert radians to degrees
  const angleInDegrees = angleInRadians * (180 / Math.PI);
  return angleInDegrees;
};

/**
 * Calculates the minimum boom length required to reach a specific lift radius and boom angle.
 *
 * @param {number} liftRadius - The horizontal distance from the crane to the load.
 * @param {number} boomAngle - The angle of the boom in degrees.
 * @returns {number} The calculated minimum boom length.
 */
export const calculateMinBoomLength = (liftRadius: number, boomAngle: number): number => {
  // Convert the angle from degrees to radians
  const angleInRadians = boomAngle * (Math.PI / 180);
  // Calculate the minimum boom length using the cosine function
  return liftRadius / Math.cos(angleInRadians);
};

/**
 * Calculates the total load including the weight of the load and the lift tackle.
 *
 * @param {number} loadWeight - The weight of the load.
 * @param {number} liftTackle - The weight of the lift tackle.
 * @returns {number} The total load.
 */
export const calculateTotalLoad = (loadWeight: number, liftTackle: number): number => {
  return loadWeight + liftTackle;
};

/**
 * Calculates the vertical height reached by the boom at a given length and angle.
 *
 * @param {number} boomLength - The length of the boom.
 * @param {number} boomAngle - The angle of the boom in degrees.
 * @returns {number} The calculated vertical height.
 */
export const calculateVerticalHeight = (boomLength: number, boomAngle: number): number => {
  // Convert the angle from degrees to radians
  const angleInRadians = boomAngle * (Math.PI / 180);
  // Calculate the vertical height using the sine function
  return boomLength * Math.sin(angleInRadians);
};
