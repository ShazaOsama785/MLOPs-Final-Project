async function getPredictedLabel(processed_t) {
  try {
    // Flatten the 3D landmarks to a 1D array [x1, y1, z1, x2, y2, z2, ...]
    const flattened = processed_t.flatMap(point => [point.x, point.y, point.z]);
    
    // API endpoint of your deployed model
    const API_URL = "https://xofllpzwsczl.eu-central-1.clawcloudrun.com/predict";
    
    // Call the FastAPI model endpoint
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ landmarks: flattened })
    });
    
    if (!response.ok) {
      console.error("Prediction API error:", response.status, response.statusText);
      return null; // On failure, stop and wait
    }
    
    const result = await response.json();
    const gesture = result.gesture;
    
    // Map your gesture labels to movement controls
    if (gesture === "one") return "up";
    if (gesture === "dislike") return "down";
    if (gesture === "three") return "left";
    if (gesture === "two_up") return "right";
    
    return null; // Gesture not mapped to movement
  } catch (error) {
    console.error("Failed to call prediction API:", error);
    return null; // On error, stop and wait
  }
}